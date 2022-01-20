/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react';
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { queryStringGenerate } from '@Utils/routerUtils';
import { useAppSelector, useAppDispatch } from '@State/hook';
import { setDisabledDetectScrollDirection } from '@State/navigator';
import { useForm } from 'react-hook-form';
import { maybe, oneOf } from 'decoders';
import { validateWithFallbackValue } from '@Utils/typeGuard';
import { themeBreakpoints } from '@Utils/themeUtils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IoChevronDown } from 'react-icons/io5';
import { CgOptions } from 'react-icons/cg';
import { productNavigate, ProductCategory, productData, ProductDetail, getPriceDisplay } from '@Data/products';
import ProductCard from '@Components/Card/CardProduct';
import Loading from '@Components/Indicators/Loading';
import ProductMobileMenu from '@Features/Products/MobileMenu';
import ProductDesktopMenu from '@Features/Products/DesktopMenu';
import { MainNavHeight } from '@Components/Navbar';

export type ProductFilter = {
  sortBy: 'createdTime' | 'price' | 'price-desc';
  priceRange?: ('0' | '1' | '2' | '3' | '4')[];
};

export const translateSortbyDisplay = (sortBy: string) => {
  switch (sortBy) {
    case 'createdTime':
      return 'Newest';
    case 'price':
      return 'Price: Low to High';
    case 'price-desc':
      return 'Price: High to Low';
    default:
      return 'Unknown!';
  }
};

const productDataFilter = (
  category: ProductCategory,
  sortBy: 'createdTime' | 'price' | 'price-desc',
  priceRange?: ('0' | '1' | '2' | '3' | '4')[],
) => {
  let result: ProductDetail[] = [];
  const rawFilter = category ? productData.filter((x) => x.category == category) : productData;
  if (priceRange && priceRange.length !== 0) {
    const filterProductMinPrice = rawFilter.filter((x) => x.minPrice);
    priceRange.map((type) => {
      switch (type) {
        case '0': {
          result = result.concat(filterProductMinPrice.filter((x) => x.minPrice! <= 50));
          break;
        }
        case '1': {
          result = result.concat(filterProductMinPrice.filter((x) => x.minPrice! > 50 && x.minPrice! <= 200));
          break;
        }
        case '2': {
          result = result.concat(filterProductMinPrice.filter((x) => x.minPrice! > 200 && x.minPrice! <= 500));
          break;
        }
        case '3': {
          result = result.concat(filterProductMinPrice.filter((x) => x.minPrice! > 500 && x.minPrice! <= 1000));
          break;
        }
        case '4': {
          result = result.concat(filterProductMinPrice.filter((x) => x.minPrice! > 1000));
          break;
        }
        default:
          return;
      }
    });
    result = result.concat(rawFilter.filter((x) => !x.minPrice));
  } else {
    result = rawFilter;
  }

  switch (sortBy) {
    case 'createdTime':
      return result.sort((a, b) => b.createdTime.localeCompare(a.createdTime));
    case 'price':
      return result.sort((a, b) => {
        if ((!a.minPrice && !b.minPrice) || a.minPrice == b.minPrice) return 0;
        else if (!a.minPrice && b.minPrice) return -1;
        else if (a.minPrice && !b.minPrice) return 1;
        else return a.minPrice! < b.minPrice! ? -1 : 1;
      });
    case 'price-desc':
      return result.sort((a, b) => {
        if ((!a.minPrice && !b.minPrice) || a.minPrice == b.minPrice) return 0;
        else if (!a.minPrice && b.minPrice) return -1;
        else if (a.minPrice && !b.minPrice) return 1;
        else return a.minPrice! < b.minPrice! ? 1 : -1;
      });
    default:
      return result;
  }
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;
  // Got to standardize all field, even optinal
  const standardizeQuery: ProductFilter = {
    sortBy: validateWithFallbackValue(
      query.sortBy,
      maybe(oneOf(['createdTime', 'price', 'price-desc'])),
      'createdTime',
    ),
    priceRange: Array.isArray(query.priceRange)
      ? (query.priceRange as string[])
          .map((item) => validateWithFallbackValue(item, oneOf(['0', '1', '2', '3', '4'])))
          .filter((item) => !!item)
      : query.priceRange
      ? validateWithFallbackValue(query.priceRange, oneOf(['0', '1', '2', '3', '4']))
        ? [validateWithFallbackValue(query.priceRange, oneOf(['0', '1', '2', '3', '4']))]
        : []
      : [],
  };

  const pageSize = 10;
  const category = validateWithFallbackValue(
    query.category,
    oneOf(['accessories', 'cables', 'dac-amp', 'earbuds', 'in-ear', 'not-by-ve', 'omega']),
    '',
  );
  // const productFilterResult = category ? productData.filter((x) => x.category == category) : productData;
  // This process should be handled on backend-side, we just do some kind of simulate here!
  const productFilterResult = productDataFilter(category, standardizeQuery.sortBy, standardizeQuery.priceRange);
  return {
    props: {
      pageSize: pageSize,
      totalItems: productFilterResult.length,
      firstPageData: productFilterResult.slice(0, pageSize),
      initialFilterData: standardizeQuery,
      category: category,
    },
  };
};

const Products: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  pageSize,
  totalItems,
  firstPageData,
  initialFilterData,
  category,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const globalScrollDirection = useAppSelector((state) => state.navigator.scrollDirection);
  const [desktopStickyEl, setDesktopStickyEl] = useState<HTMLElement | null>(null);
  const [choosedCategory, setChoosedCategory] = useState(category);
  const [categoryDisplay, setCategoryDisplay] = useState('');
  const [stickyProductHeader, setStickyProductHeader] = useState(false);
  const [sortByDesktopOpen, setSortByDesktopOpen] = useState(false);
  const [navMenuToRender, setNavMenuToRender] = useState<'desktop' | 'mobile'>('desktop');
  const [leftNavbarTopOffset, setLeftNavbarTopOffset] = useState(0);
  const [openLeftNavbar, setOpenLeftNavbar] = useState(true);
  const [data, setData] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { register, getValues, setValue, handleSubmit, reset } = useForm<ProductFilter>({
    defaultValues: initialFilterData,
  });

  const onSubmit = (data: ProductFilter) =>
    router.push(`${router.pathname}?${queryStringGenerate({ ...data, category: category })}`);

  // Faking API get data
  const fetchData = new Promise<ProductDetail[]>((resolve) => {
    const productFilter = category ? productData.filter((x) => x.category == category) : productData;
    setTimeout(() => resolve(productFilter.slice(data.length, data.length + pageSize)), 1500);
  });

  const handleFetchingData = () => {
    setLoading(true);
    fetchData.then((data) => {
      setData((prev) => [...prev, ...data]);
      setLoading(false);
    });
  };

  useEffect(() => {
    const onWindowResize = () => setNavMenuToRender(window.innerWidth < themeBreakpoints.md ? 'mobile' : 'desktop');
    onWindowResize();

    window.addEventListener('resize', onWindowResize);
    return () => window.removeEventListener('resize', onWindowResize);
  }, []);

  useEffect(() => {
    setData(firstPageData);
    const detail = productNavigate.find((x) => x.category === category);
    setCategoryDisplay(detail ? detail.displayName : 'All Products');
  }, [router.asPath]);

  useEffect(() => {
    if (choosedCategory !== category) {
      const currentFormData = getValues();
      router.push(`${router.pathname}?${queryStringGenerate({ ...currentFormData, category: choosedCategory })}`);
    }
  }, [choosedCategory]);

  useEffect(() => {
    const onScroll = () => setStickyProductHeader(window.scrollY > MainNavHeight);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [globalScrollDirection]);

  useEffect(() => {
    const mainNavbarRect = (document.querySelector('#site-nav-bar') as Element).getBoundingClientRect();
    const productStickyRect = desktopStickyEl?.getBoundingClientRect();

    if (productStickyRect) {
      setLeftNavbarTopOffset(
        globalScrollDirection === 'up'
          ? Math.floor(mainNavbarRect.height + productStickyRect.height)
          : Math.floor(productStickyRect.height),
      );
    }
  }, [desktopStickyEl, globalScrollDirection]);

  return (
    <div className="w-full">
      <div
        className={`w-full bg-white z-10 ${stickyProductHeader ? 'sticky top-0' : 'relative'} ${
          globalScrollDirection === 'up' && stickyProductHeader ? 'translate-y-14' : 'translate-y-0'
        } transition-transform duration-200`}
      >
        <div
          className="site-container min-h-[48px] flex items-center justify-between"
          ref={(node) => setDesktopStickyEl(node)}
        >
          <h4 className={`text-xl ${stickyProductHeader ? 'scale-75' : 'scale-100'} transition-transform duration-200`}>
            {categoryDisplay}
            <span className="hidden md:inline-block">&nbsp;({totalItems})</span>
          </h4>
          <div className="hidden md:inline-flex">
            <button
              className="inline-flex items-center px-2 py-1"
              onClick={() => {
                setOpenLeftNavbar((prev) => !prev);
                dispatch(setDisabledDetectScrollDirection({ period: 200 }));
              }}
            >
              <span className="mr-2">Hide Filter</span>
              <CgOptions />
            </button>
            <button className="ml-4" onClick={() => setSortByDesktopOpen((prev) => !prev)}>
              <div className="inline-flex">
                <span className="mr-2">Sort by: {translateSortbyDisplay(getValues('sortBy'))}</span>
                <IoChevronDown
                  className={`mt-[6px] transition-transform duration-200 ${
                    sortByDesktopOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>

              <div
                className={`absolute right-1 w-44 rounded-md bg-white shadow-lg transition-transform duration-200 [transform-origin:_top_right;] ${
                  sortByDesktopOpen ? 'scale-y-100' : 'scale-y-0'
                }`}
              >
                <span
                  className="w-full text-right pt-2 pr-7 hover:text-rose-400 transition-colors"
                  onClick={() => {
                    setValue('sortBy', 'createdTime');
                    handleSubmit(onSubmit)();
                  }}
                >
                  {translateSortbyDisplay('createdTime')}
                </span>
                <span
                  className="w-full text-right py-2 pr-7 hover:text-rose-400 transition-colors"
                  onClick={() => {
                    setValue('sortBy', 'price-desc');
                    handleSubmit(onSubmit)();
                  }}
                >
                  {translateSortbyDisplay('price-desc')}
                </span>

                <span
                  className="w-full text-right pb-3 pr-7 hover:text-rose-400 transition-colors"
                  onClick={() => {
                    setValue('sortBy', 'price');
                    handleSubmit(onSubmit)();
                  }}
                >
                  {translateSortbyDisplay('price')}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="site-container w-full md:hidden">
        <div className="h-12 relative overflow-y-hidden overflow-x-auto hide-scrollbar-horizontal">
          <ul className="flex items-center pt-2 absolute border-b border-slate-200">
            {productNavigate.map((item) => (
              <li
                key={item.displayName}
                className={`group list-none ml-4 first-of-type:ml-0 cursor-pointer ${
                  item.category == category ? 'text-slate-700' : ''
                } hover:text-slate-700 transition-colors duration-300`}
                onClick={() => setChoosedCategory(item.category)}
              >
                <span className="whitespace-nowrap">{item.displayName}</span>
                <hr
                  className={`mt-2 h-0.5 bg-black scale-x-0 ${
                    item.category == category ? 'scale-x-100' : ''
                  } group-hover:scale-x-100 transition-transform duration-300`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-container flex md:hidden items-center justify-between w-full h-14">
        <span className="text-slate-500">{totalItems} Results</span>
        <button
          className="inline-flex items-center border border-slate-400 rounded-3xl h-6"
          onClick={() => setMobileFilterOpen((prev) => !prev)}
        >
          <span className="text-sm ml-4 mr-1">Filter</span>
          <CgOptions className="mr-4" />
        </button>
      </div>

      <div className="site-container flex flex-row w-full">
        {navMenuToRender === 'desktop' && (
          <ProductDesktopMenu
            isOpen={openLeftNavbar}
            topPositionOffset={leftNavbarTopOffset}
            handleClearFilter={() => reset()}
            handleSubmit={handleSubmit}
            register={register}
            getFormValues={getValues}
            category={category}
          />
        )}

        <main>
          <section>
            <InfiniteScroll
              dataLength={data.length}
              next={handleFetchingData}
              hasMore={data.length < totalItems}
              loader={<></>}
              className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {data.map((item, idx) => (
                <ProductCard
                  key={`${item.name}_${idx}`}
                  imageUrl={item.thumbNail}
                  category={item.category}
                  title={item.name}
                  description={item.description}
                  price={getPriceDisplay(item.minPrice, item.maxPrice)}
                  productUrl={`/products/${item.productDetailSlug}`}
                />
              ))}
            </InfiniteScroll>
            {loading && (
              <div className="w-full h-20">
                <Loading size={40} />
              </div>
            )}
          </section>
        </main>
      </div>

      {navMenuToRender === 'mobile' && (
        <ProductMobileMenu
          isOpen={mobileFilterOpen}
          toggleMenu={() => setMobileFilterOpen((prev) => !prev)}
          handleClearFilter={() => reset()}
          handleSubmit={handleSubmit}
          register={register}
          category={category}
        />
      )}
    </div>
  );
};

export default Products;

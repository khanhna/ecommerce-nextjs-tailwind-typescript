/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import type { NextPage, GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import SwiperCore, { FreeMode, Navigation, Zoom, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Dialog } from '@headlessui/react';
import { RiCloseCircleFill } from 'react-icons/ri';
import { IoChevronDown } from 'react-icons/io5';
import toast, { Toaster } from 'react-hot-toast';
import { productData, ProductDetail, getPriceDisplay } from '@Data/products';
import { isStringNullOrUndefinedOrEmprty } from '@Utils/stringUtils';
import { add as addProductCart, convertProductDetailToProductCompact } from '@State/cart';
import { useAppDispatch } from '@State/hook';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/zoom';
import 'swiper/css/thumbs';

SwiperCore.use([FreeMode, Navigation, Zoom, Thumbs]);

export const getStaticPaths: GetStaticPaths = () => ({
  paths: productData.map((item) => ({ params: { slug: [item.productDetailSlug] } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = ({ params }) => {
  const slugs = params?.slug as string[];
  const productDetail = productData.find((x) => x.productDetailSlug === slugs[0]);

  if (!productDetail) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      source: productDetail,
    },
  };
};

const ProductDetailPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ source }) => {
  const product = source as ProductDetail;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [desktopImagesOpen, setDesktopImagesOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [choosedEdition, setChoosedEdition] = useState<string>();
  const [insistChoosingEdition, setInsistChoosingEdition] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [openDescriptionSection, setOpenDescriptionSection] = useState(true);
  const [descriptionSectionEl, setDescriptionSectionEl] = useState<HTMLElement | null>(null);

  const handleAddProduct = () => {
    if (isStringNullOrUndefinedOrEmprty(choosedEdition)) {
      setInsistChoosingEdition(true);
      return;
    }

    dispatch(
      addProductCart({ product: convertProductDetailToProductCompact(product, choosedEdition as string, quantity) }),
    );

    toast.success(`Added ${quantity} of ${product.name} - ${choosedEdition} to Cart!`, {
      position: 'top-center',
      duration: 1500,
    });
  };

  useEffect(() => {
    setChoosedEdition(undefined);
    setInsistChoosingEdition(false);
    setQuantity(1);
  }, [router.asPath]);

  return (
    <>
      <Toaster />
      <div className="site-container md:flex md:flex-row md:mt-8">
        <div className="hidden md:block md:mr-6 md:w-7/12 md:mb-8">
          <div className="grid grid-cols-2 gap-2">
            {product.images.map((imageUrl: string, idx) => (
              <img
                key={`${product.name}_${idx}`}
                src={imageUrl}
                alt={product.name + `_${idx}`}
                className="cursor-pointer"
                onClick={() => setDesktopImagesOpen((prev) => !prev)}
              />
            ))}
          </div>
        </div>

        <div className="md:w-5/12">
          <div className="md:mx-8">
            <h1 className="text-3xl leading-[1.2] tracking-[0.007em]">{product.name}</h1>
            <h2 className="text-xs md:text-sm">{product.categoryDisplay}</h2>

            <p className="mt-4">{getPriceDisplay(product.minPrice, product.maxPrice)}</p>
          </div>

          <div className="w-[90vw] md:hidden">
            <Swiper
              navigation={true}
              zoom={true}
              thumbs={{ swiper: thumbsSwiper }}
              className="swiper-product-detail [--swiper-navigation-size:_14px]"
            >
              {product.images.map((imageUrl: string, idx) => (
                <SwiperSlide key={imageUrl}>
                  <div className="swiper-zoom-container">
                    <img src={imageUrl} alt={product.name + `_${idx}`} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={4}
              slidesPerView={7}
              freeMode={true}
              watchSlidesProgress={true}
              className="swiper-product-thumbs"
            >
              {product.images.map((imageUrl: string, idx) => (
                <SwiperSlide key={imageUrl}>
                  <img
                    src={imageUrl}
                    alt={product.name + `_${idx}`}
                    className="w-[(100vw - 38px)/7] h-[(100vw - 38px)/7] rounded hover:scale-[.97]"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="w-full">
            <h5 className={`md:ml-10 text-s md:mt-8 ${insistChoosingEdition ? 'text-red-400' : 'text-slate-500'}`}>
              Editions
            </h5>
            <div
              className={`flex flex-wrap my-2 md:mx-6 ${
                insistChoosingEdition ? 'rounded-md border border-red-500' : ''
              }`}
            >
              {product.variants.map((item) => (
                <button
                  key={item}
                  className={`ml-2 my-1 px-2 py-1 text-sm rounded border border-slate-300 ${
                    choosedEdition == item ? 'border-black' : ''
                  } hover:border-black`}
                  onClick={() => {
                    setChoosedEdition(item);
                    setInsistChoosingEdition(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            <h5 className="md:ml-10 mt-6 mb-2 text-sm text-slate-500">Quantity</h5>
            <div className="md:ml-8 mr-6 flex flex-row">
              <button
                className={`px-6 py-2 shadow rounded-md text-xl text-white ${
                  quantity === 1 ? 'cursor-default bg-[#626262]' : 'hover:shadow-lg bg-black hover:bg-opacity-80'
                }`}
                onClick={() => setQuantity((prev) => (prev === 1 ? 1 : --prev))}
              >
                -
              </button>
              <input
                type="number"
                className="w-32 mx-0.5 text-xl text-center rounded border border-black hidden-default-number-increment"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    isStringNullOrUndefinedOrEmprty(e.target.value)
                      ? 1
                      : parseInt(e.target.value) <= 1
                      ? 1
                      : parseInt(e.target.value),
                  )
                }
              />
              <button
                className="px-6 py-2 shadow hover:shadow-lg rounded-md text-xl text-white bg-black hover:bg-opacity-80"
                onClick={() => setQuantity((prev) => ++prev)}
              >
                +
              </button>
            </div>
          </div>

          <div className="md:mx-8 mt-6">
            <button
              className="w-full mx-auto bg-black hover:bg-opacity-80 text-white rounded-3xl py-2"
              onClick={handleAddProduct}
            >
              Add to Cart
            </button>
          </div>

          <div className="w-full">
            <div className="md:mx-6">
              <button
                className="mt-8 border-t border-t-slate-200 w-full inline-flex items-center justify-between"
                onClick={() => setOpenDescriptionSection((prev) => !prev)}
              >
                <span className="text-xl my-2">Product Detail</span>{' '}
                <IoChevronDown
                  className={`transition-transform duration-200 ${openDescriptionSection ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`text-xs transition-all duration-300 overflow-y-hidden ${
                  openDescriptionSection ? 'mb-8' : ''
                }`}
                ref={(node) => setDescriptionSectionEl(node)}
                style={{
                  maxHeight: openDescriptionSection
                    ? descriptionSectionEl?.scrollHeight
                      ? `${descriptionSectionEl.scrollHeight}px`
                      : '0px'
                    : '0px',
                }}
              >
                {product.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        as="div"
        className="fixed inset-0 z-50"
        open={desktopImagesOpen}
        onClose={() => setDesktopImagesOpen((prev) => !prev)}
      >
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <button className="absolute top-4 right-4 z-50" onClick={() => setDesktopImagesOpen((prev) => !prev)}>
          <RiCloseCircleFill size={38} />
        </button>
        <div className="fixed inset-0 overflow-y-auto">
          {product.images.map((imageUrl: string, idx) => (
            <Image
              key={`${product.name}_${idx}`}
              src={imageUrl}
              alt={product.name + `_${idx}`}
              width="100%"
              height="100%"
              objectFit="contain"
              layout="responsive"
              priority={true}
            />
          ))}
        </div>
      </Dialog>
    </>
  );
};

export default ProductDetailPage;

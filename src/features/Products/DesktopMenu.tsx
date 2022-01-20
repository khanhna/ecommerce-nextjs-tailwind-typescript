import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { queryStringGenerate } from '@Utils/routerUtils';
import { UseFormRegister, UseFormHandleSubmit, UseFormGetValues } from 'react-hook-form';
import { productNavigate } from '@Data/products';
import InputCheckBox from '@Components/Elements/Input/CheckBox';
import { ProductFilter } from 'src/pages/products/index';
import { IoChevronUp } from 'react-icons/io5';

type Props = {
  isOpen: boolean;
  topPositionOffset: number;
  handleClearFilter: () => void;
  register: UseFormRegister<ProductFilter>;
  handleSubmit: UseFormHandleSubmit<ProductFilter>;
  getFormValues: UseFormGetValues<ProductFilter>;
  category?: string;
};

const DesktopMenu: FC<Props> = ({
  isOpen,
  topPositionOffset,
  handleClearFilter,
  register,
  handleSubmit,
  getFormValues,
  category,
}) => {
  const router = useRouter();
  const [visibleScrollbar, setVisibleScrollbar] = useState(false);
  const [chooseCategory, setChooseCategory] = useState(category);
  const [priceFilterOpen, setPriceFilterOpen] = useState(false);
  const onSubmit = (data: ProductFilter) =>
    router.push(`${router.pathname}?${queryStringGenerate({ category: chooseCategory, ...data })}`);

  useEffect(() => {
    if (chooseCategory !== category) {
      const currentFormData = getFormValues();
      router.push(`${router.pathname}?${queryStringGenerate({ category: chooseCategory, ...currentFormData })}`);
    }
  }, [chooseCategory]);

  return (
    <div
      className="hidden md:flex sticky max-w-xl transition-all duration-300"
      style={{
        top: `${topPositionOffset}px`,
        maxHeight: `calc(100vh - ${topPositionOffset}px)`,
      }}
    >
      <div
        className={`${isOpen ? 'w-56' : 'w-0'} overflow-x-hidden overflow-y-auto vertical-scrollbar ${
          visibleScrollbar ? '[color:_rgba(0,0,0,0.6)]' : '[color:_rgba(0,0,0,0)]'
        } transition-all duration-300`}
        onMouseEnter={() => setVisibleScrollbar(true)}
        onMouseLeave={() => setVisibleScrollbar(false)}
      >
        <div className="w-full text-black">
          <ul>
            {productNavigate.map((item) => (
              <li
                key={item.displayName}
                className="my-1 list-none cursor-pointer hover:text-rose-400 hover:font-semibold hover:underline transition-colors duration-300"
                onClick={() => setChooseCategory(item.category)}
              >
                <span className={`whitespace-nowrap ${item.category == category ? 'font-semibold underline' : ''}`}>
                  {item.displayName}
                </span>
              </li>
            ))}
          </ul>
          <div className="my-6 mr-4 border-t">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h6
                className="my-4 mr-4 w-full flex items-center justify-between text-md text-blueGray-600 cursor-pointer"
                onClick={() => setPriceFilterOpen((prev) => !prev)}
              >
                <span className="whitespace-nowrap">Shop By Price</span>
                <IoChevronUp className={`transition-transform duration-300 ${priceFilterOpen ? '' : 'rotate-180'}`} />
              </h6>
              <fieldset
                className={`my-2 border-b ${
                  priceFilterOpen ? 'max-h-36' : ' max-h-0'
                } transition-[max-height] duration-300 overflow-hidden`}
              >
                <InputCheckBox id="less50" value="0" labelName="< $50" className="my-1.5" {...register('priceRange')} />
                <InputCheckBox
                  id="50to200"
                  value="1"
                  labelName="$50 - $200"
                  className="my-1.5"
                  {...register('priceRange')}
                />
                <InputCheckBox
                  id="200to500"
                  value="2"
                  labelName="$200 - $500"
                  className="my-1.5"
                  {...register('priceRange')}
                />
                <InputCheckBox
                  id="500to1000"
                  value="3"
                  labelName="$500 - $1000"
                  className="my-1.5"
                  {...register('priceRange')}
                />
                <InputCheckBox
                  id="more1000"
                  value="4"
                  labelName="> $1000"
                  className="mt-1.5 mb-4"
                  {...register('priceRange')}
                />
              </fieldset>
              <div className="m-1">
                <button
                  type="button"
                  className="my-1 w-full border border-slate-500 rounded-2xl h-8 hover:bg-slate-100 transition-colors text-sm"
                  onClick={handleClearFilter}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="w-full border border-black rounded-2xl bg-black text-white h-8 cursor-pointer text-sm"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopMenu;

import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { queryStringGenerate } from '@Utils/routerUtils';
import { UseFormRegister, UseFormHandleSubmit } from 'react-hook-form';
import { RiCloseCircleFill } from 'react-icons/ri';
import InputRadio from '@Components/Elements/Input/Radio';
import InputCheckBox from '@Components/Elements/Input/CheckBox';
import { translateSortbyDisplay, ProductFilter } from 'src/pages/products';

type Props = {
  isOpen: boolean;
  toggleMenu: () => void;
  handleClearFilter: () => void;
  register: UseFormRegister<ProductFilter>;
  handleSubmit: UseFormHandleSubmit<ProductFilter>;
  category?: string;
};

const MobileMenu: FC<Props> = ({ isOpen, toggleMenu, handleClearFilter, register, handleSubmit, category }) => {
  const router = useRouter();
  const onSubmit = (data: ProductFilter) => {
    toggleMenu();
    router.push(`${router.pathname}?${queryStringGenerate({ category, ...data })}`);
  };

  useEffect(() => {
    const rootElement = document.querySelector('html');
    if (rootElement?.style?.overflow === '' || rootElement?.style?.overflow === 'hidden') {
      rootElement.style.overflow = isOpen ? 'hidden' : '';
    }
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-site-overlay bg-opacity-75 backdrop-blur-sm ${
          isOpen ? 'opacity-100 z-30' : 'opacity-0 z-[-1]'
        } ease-in-out duration-300`}
      />
      <div
        className={`fixed inset-0 z-30 bg-white ${
          isOpen ? 'scale-y-100' : 'scale-y-0'
        } transition-transform duration-300 [transform-origin:_bottom_center;]`}
      >
        <h4 className="mt-6 px-4 h-12 text-2xl">Filter</h4>
        <button className="absolute top-4 right-4" onClick={toggleMenu}>
          <RiCloseCircleFill size={38} />
        </button>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="h-[calc(100vh-136px)] overflow-x-hidden overflow-y-auto">
            <fieldset className="flex flex-col my-2 px-4 border-b">
              <legend className="my-4 text-md text-blueGray-600">Sort By</legend>
              <InputRadio
                className="mb-2"
                id="sort-newest"
                value="createdTime"
                labelName={translateSortbyDisplay('createdTime')}
                {...register('sortBy')}
              />
              <InputRadio
                className="mb-2"
                id="price-desc"
                value="price-desc"
                labelName={translateSortbyDisplay('price-desc')}
                {...register('sortBy')}
              />
              <InputRadio
                className="mb-4"
                id="price"
                value="price"
                labelName={translateSortbyDisplay('price')}
                {...register('sortBy')}
              />
            </fieldset>
            <fieldset className="flex flex-col my-2 px-4 border-b">
              <legend className="my-4 text-md text-blueGray-600">Shop By Price</legend>
              <InputCheckBox id="less50" value="0" labelName="< $50" className="my-1" {...register('priceRange')} />
              <InputCheckBox
                id="50to200"
                value="1"
                labelName="$50 - $200"
                className="my-1"
                {...register('priceRange')}
              />
              <InputCheckBox
                id="200to500"
                value="2"
                labelName="$200 - $500"
                className="my-1"
                {...register('priceRange')}
              />
              <InputCheckBox
                id="500to1000"
                value="3"
                labelName="$500 - $1000"
                className="my-1"
                {...register('priceRange')}
              />
              <InputCheckBox
                id="more1000"
                value="4"
                labelName="> $1000"
                className="mt-1 mb-4"
                {...register('priceRange')}
              />
            </fieldset>
          </div>
          <div className="mt-auto h-16 px-4 border-t flex items-center justify-between">
            <button
              type="button"
              className="mr-1 flex-1 h-8 border border-slate-500 rounded-2xl hover:bg-slate-100 transition-colors text-sm"
              onClick={handleClearFilter}
            >
              Clear
            </button>
            <button
              type="submit"
              className="ml-1 flex-1 h-8 border border-black rounded-2xl bg-black text-white text-sm"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default MobileMenu;

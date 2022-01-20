import { FC, Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { RiCloseCircleFill } from 'react-icons/ri';
import { useAppSelector, useAppDispatch } from '@State/hook';
import {
  add as addItem,
  reduce as reduceItem,
  remove as removeItem,
  setQuantity as setProductQuantity,
  ProductCompact,
} from '@State/cart';
import { simpleCurrencyFormat, isStringNullOrUndefinedOrEmprty } from '@Utils/stringUtils';
import { themeBreakpoints } from '@Utils/themeUtils';

const CartMenu: FC<{ isOpen: boolean; toggleMenu: () => void }> = ({ isOpen, toggleMenu }) => {
  const cart = useAppSelector((state) => state.appPersist.cart);
  const dispatch = useAppDispatch();
  const [visibleScrollbar, setVisibleScrollbar] = useState(window.innerWidth <= themeBreakpoints.sm);
  const [sortedProduct, setSortedProduct] = useState<ProductCompact[]>([]);
  const [minSubTotal, setMinSubTotal] = useState(0);
  const [maxSubTotal, setMaxSubTotal] = useState(0);

  useEffect(() => {
    setMinSubTotal(
      cart.products.reduce((prev, curr) => (curr.minPrice ? prev + curr.minPrice * curr.quantity : prev), 0),
    );
    setMaxSubTotal(
      cart.products.reduce(
        (prev, curr) =>
          curr.maxPrice
            ? prev + curr.maxPrice * curr.quantity
            : curr.minPrice
            ? prev + curr.minPrice * curr.quantity
            : prev,
        0,
      ),
    );
    setSortedProduct(
      cart.products.slice().sort((a, b) => `${a.name}-${a.edition}`.localeCompare(`${b.name}-${b.edition}`)),
    );
  }, [cart.products]);

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="z-20 fixed inset-0 overflow-hidden" onClose={toggleMenu}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-site-overlay opacity-90 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition-transform ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition-transform ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div
                className="w-screen max-w-md"
                onMouseEnter={() => setVisibleScrollbar(true)}
                onMouseLeave={() => setVisibleScrollbar(false)}
              >
                <div className="h-full flex flex-col px-4 sm:px-6 bg-white shadow-xl">
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                      <button type="button" className="text-gray-700 hover:text-gray-900" onClick={toggleMenu}>
                        <span className="sr-only">Close panel</span>
                        <RiCloseCircleFill className="h-7 w-7" aria-hidden="true" />
                      </button>
                    </div>

                    <div
                      className={`mt-4 h-[calc(100vh-292px)] overflow-y-auto vertical-scrollbar ${
                        visibleScrollbar ? '[color:_rgba(0,0,0,0.6)]' : '[color:_rgba(0,0,0,0)]'
                      } transition-colors duration-[400ms]`}
                    >
                      <div className="flow-root">
                        {cart.products.length > 0 ? (
                          <ul role="list" className="divide-y divide-gray-200">
                            {sortedProduct.map((item) => (
                              <li key={`${item.name}_${item.edition}`} className="py-6 flex">
                                <div className="relative flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                  <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" />
                                </div>

                                <div className="ml-4 flex-1 flex flex-col">
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <Link href={item.url} passHref>
                                      <a onClick={toggleMenu}>{item.name}</a>
                                    </Link>
                                    <p className="ml-4">
                                      {item.minPrice
                                        ? simpleCurrencyFormat.format(item.minPrice * item.quantity)
                                        : simpleCurrencyFormat.format(0)}{' '}
                                      {item.maxPrice &&
                                        ` - ${simpleCurrencyFormat.format(item.maxPrice * item.quantity).slice(1)}`}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-500 max-w-[240px] whitespace-nowrap text-ellipsis overflow-x-hidden">
                                    {item.edition}
                                  </p>
                                  <div className="flex-1 flex items-end justify-between text-sm">
                                    <div className="inline-flex flex-row items-center">
                                      <p className="text-gray-500 mr-2">Qty</p>
                                      <button
                                        className={`px-[9px] py-[1px] shadow rounded-md text-white  ${
                                          item.quantity === 1
                                            ? 'cursor-default bg-[#626262]'
                                            : 'hover:shadow-lg bg-black hover:bg-opacity-80'
                                        }`}
                                        onClick={() => {
                                          if (item.quantity > 1)
                                            dispatch(reduceItem({ product: { ...item, quantity: 1 } }));
                                        }}
                                      >
                                        -
                                      </button>
                                      <input
                                        type="number"
                                        className="w-12 mx-0.5 text-center rounded border text-black border-gray-800 hidden-default-number-increment"
                                        value={item.quantity}
                                        onChange={(e) =>
                                          dispatch(
                                            setProductQuantity({
                                              productCode: item.code,
                                              edition: item.edition,
                                              quantity: isStringNullOrUndefinedOrEmprty(e.target.value)
                                                ? 1
                                                : parseInt(e.target.value) <= 1
                                                ? 1
                                                : parseInt(e.target.value),
                                            }),
                                          )
                                        }
                                      />
                                      <button
                                        className="px-2 py-[1px] shadow hover:shadow-lg rounded-md text-white bg-black hover:bg-opacity-80"
                                        onClick={() => dispatch(addItem({ product: { ...item, quantity: 1 } }))}
                                      >
                                        +
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        dispatch(removeItem({ productCode: item.code, edition: item.edition }))
                                      }
                                      className="font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div>
                            <p className="text-gray-500">There&lsquo;s nothing in your cart!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {cart.products.length > 0 ? (
                    <div className="border-t border-gray-200 mt-2 pt-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>
                          {simpleCurrencyFormat.format(minSubTotal)}{' '}
                          {maxSubTotal !== 0 && ` - ${simpleCurrencyFormat.format(maxSubTotal).slice(1)}`}
                        </p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">We&lsquo;ll contact later for specific amount</p>
                      <Link href="/checkout" passHref>
                        <a
                          className="mt-6 flex justify-center items-center py-3 rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800"
                          onClick={toggleMenu}
                        >
                          Checkout
                        </a>
                      </Link>
                      <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                        <p>
                          or{' '}
                          <button type="button" className="font-medium hover:text-gray-800" onClick={toggleMenu}>
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default CartMenu;

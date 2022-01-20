import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '@State/hook';
import { clear as clearCart } from '@State/cart';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProductCompact } from '@State/cart';
import { IoChevronDown } from 'react-icons/io5';
import { FiShoppingCart } from 'react-icons/fi';
import { themeBreakpoints } from '@Utils/themeUtils';
import { simpleCurrencyFormat } from '@Utils/stringUtils';
import Input from '@Components/Elements/Input';

type ProductDetail = {
  code: string;
  edition: string;
  quantity: number;
  minPrice?: number;
  maxPrice?: number;
};

type CheckoutForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  postcode: string;
  apt: string;
  city: string;
  country: string;
  minSubTotal?: number;
  maxSubTotal?: number;
  products: ProductDetail[];
};

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required!'),
  lastName: yup.string().required('Last name is required!'),
  email: yup.string().email('Please fill a valid email!'),
  phone: yup.string().required('Phone number is required!'),
  streetAddress: yup.string().required('Street address is required!'),
  postcode: yup.string().required('Post/zip code is required!'),
  apt: yup.string().required('Apt, suit,... is required!'),
  city: yup.string().required('City is required!'),
  country: yup.string().required('Country is required!'),
});

const CheckoutPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.appPersist.cart);
  const router = useRouter();
  const [windowSize, setWindowSize] = useState<'desktop' | 'mobile'>('desktop');
  const [mobilerderDetailOpen, setMobilerderDetailOpen] = useState(false);
  const [sortedProduct, setSortedProduct] = useState<ProductCompact[]>([]);
  const [minSubTotal, setMinSubTotal] = useState(0);
  const [maxSubTotal, setMaxSubTotal] = useState(0);
  const [someRandomShippingFee] = useState(Math.random() * 100);
  const [mobileOrderDetailSectionEl, setMobileOrderDetailSectionEl] = useState<HTMLElement | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CheckoutForm>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      streetAddress: '',
      postcode: '',
      apt: '',
      city: '',
      country: '',
    },
  });

  const onSubmit = (source: CheckoutForm) => {
    const formToSubmit = {
      ...source,
      products: sortedProduct.map((item) => ({
        code: item.code,
        edition: item.edition,
        quantity: item.quantity,
        minPrice: item.minPrice,
        maxPrice: item.maxPrice,
      })),
      minSubTotal,
      maxSubTotal,
    };
    console.log('form to submit:', formToSubmit);
    dispatch(clearCart());
    router.push('thank-you');
  };

  useEffect(() => {
    const onWindowResize = () => setWindowSize(window.innerWidth < themeBreakpoints.md ? 'mobile' : 'desktop');
    onWindowResize();

    window.addEventListener('resize', onWindowResize);
    return () => window.removeEventListener('resize', onWindowResize);
  }, []);

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
    <div className="w-full flex flex-col md:flex-row">
      <div className="bg-[#fafafa] w-full md:border-r md:border-slate-100 md:min-h-[calc(100vh-297px)]">
        <div
          className={`border-t ${mobilerderDetailOpen ? 'border-b' : ''} border-slate-200 cursor-pointer`}
          onClick={() => setMobilerderDetailOpen((prev) => !prev)}
        >
          <div className="flex flex-row items-center justify-between max-w-xl mx-auto md:hidden">
            <button className="ml-6 my-4 inline-flex items-center justify-center text-blue-500">
              <FiShoppingCart size={24} className="flex-1" />
              <span className="text-base m-2">Show order summary</span>{' '}
              <IoChevronDown
                className={`flex-1 transition-transform duration-200 ${mobilerderDetailOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <span className="my-auto mr-4 text-xl text-center md:text-left font-medium text-gray-900">
              {simpleCurrencyFormat.format(minSubTotal)}{' '}
              {maxSubTotal !== 0 &&
                maxSubTotal !== minSubTotal &&
                ` - ${simpleCurrencyFormat.format(maxSubTotal).slice(1)}`}
            </span>
          </div>
        </div>
        <div
          className={`border-b border-slate-200 transition-all duration-300 ${
            windowSize === 'desktop' ? '' : 'overflow-y-hidden'
          }`}
          ref={(node) => setMobileOrderDetailSectionEl(node)}
          style={{
            maxHeight:
              windowSize !== 'desktop'
                ? mobilerderDetailOpen
                  ? mobileOrderDetailSectionEl?.scrollHeight
                    ? `${mobileOrderDetailSectionEl.scrollHeight}px`
                    : '0px'
                  : '0px'
                : undefined,
          }}
        >
          <div className="max-w-xl mx-auto">
            {cart.products.length > 0 ? (
              <>
                <ul role="list" className="my-2 mx-6 divide-y divide-gray-200">
                  {sortedProduct.map((item) => (
                    <li key={`${item.name}_${item.edition}`} className="py-6 flex items-center">
                      <div className="relative">
                        <span className="z-10 absolute top-0 right-0 px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#808080] rounded-full">
                          {item.quantity}
                        </span>
                        <div className="relative flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                          <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" />
                        </div>
                      </div>

                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              <Link href={item.url} passHref>
                                <a>{item.name}</a>
                              </Link>
                            </h3>
                            <p className="ml-4">
                              {item.minPrice
                                ? simpleCurrencyFormat.format(item.minPrice * item.quantity)
                                : simpleCurrencyFormat.format(0)}{' '}
                              {item.maxPrice &&
                                ` - ${simpleCurrencyFormat.format(item.maxPrice * item.quantity).slice(1)}`}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 max-w-[240px] whitespace-nowrap text-ellipsis overflow-x-hidden">
                            {item.edition}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mx-6 border-t divide-gray-200">
                  <div className="mt-6 flex flex-row items-center justify-between">
                    <p className="text-gray-500">Subtotal</p>
                    <p className="text-base font-medium text-gray-900">
                      {simpleCurrencyFormat.format(minSubTotal)}{' '}
                      {maxSubTotal !== 0 &&
                        maxSubTotal !== minSubTotal &&
                        ` - ${simpleCurrencyFormat.format(maxSubTotal).slice(1)}`}
                    </p>
                  </div>
                  <div className="mt-2 mb-6 flex flex-row items-center justify-between">
                    <p className="text-gray-500">Shipping</p>
                    <p className="text-base font-medium text-gray-900">
                      {simpleCurrencyFormat.format(someRandomShippingFee)}
                    </p>
                  </div>
                </div>

                <div className="mx-6 border-t divide-gray-200">
                  <div className="mt-6 mb-4 flex flex-row items-center justify-between">
                    <p className="text-lg text-gray-500">Total</p>
                    <p>
                      <span className="text-sm">USD</span>
                      <span className="ml-2 text-2xl font-medium text-gray-900">
                        {simpleCurrencyFormat.format(minSubTotal + someRandomShippingFee)}{' '}
                        {maxSubTotal !== 0 &&
                          maxSubTotal !== minSubTotal &&
                          ` - ${simpleCurrencyFormat.format(maxSubTotal + someRandomShippingFee).slice(1)}`}
                      </span>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="my-6 ml-6">
                <p className="leading-7">
                  There&lsquo;s nothing in your cart!
                  <br />
                  May be you want{' '}
                  <Link href="/products" passHref>
                    <a className="font-medium text-gray-500 hover:text-gray-800">
                      Continue Shopping
                      <span aria-hidden="true"> first &rarr;</span>
                    </a>
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full">
        <form className="max-w-xl mx-6 sm:mx-auto md:mx-6 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <h5 className="my-4 text-2xl">Contact information</h5>
          <div className="flex flex-row justify-between w-full">
            <fieldset className="flex-1 mr-2">
              <label className="inline-block uppercase text-blueGray-700 text-xs font-bold mb-2 ml-1">First name</label>
              <Input
                type="text"
                placeholder="First Name"
                errorMessage={<span className="text-red-500">{errors?.firstName?.message}</span>}
                errorMessageShowing={!!errors.firstName}
                {...register('firstName')}
              />
            </fieldset>
            <fieldset className="flex-1 ml-2">
              <label className="inline-block uppercase text-blueGray-700 text-xs font-bold mb-2 ml-1">Last name</label>
              <Input
                type="text"
                placeholder="Last Name"
                errorMessage={<span className="text-red-500">{errors?.lastName?.message}</span>}
                errorMessageShowing={!!errors.lastName}
                {...register('lastName')}
              />
            </fieldset>
          </div>
          <div className="flex flex-row justify-between w-full">
            <fieldset className="flex-1 mr-2">
              <label className="inline-block uppercase text-blueGray-700 text-xs font-bold mb-2 ml-1">
                Email Address
              </label>
              <Input
                type="text"
                placeholder="Email"
                errorMessage={<span className="text-red-500">{errors?.email?.message}</span>}
                errorMessageShowing={!!errors.email}
                {...register('email')}
              />
            </fieldset>
            <fieldset className="flex-1 ml-2">
              <label className="inline-block uppercase text-blueGray-700 text-xs font-bold mb-2 ml-1">Phone</label>
              <Input
                type="text"
                placeholder="Phone"
                errorMessage={<span className="text-red-500">{errors?.phone?.message}</span>}
                errorMessageShowing={!!errors.phone}
                {...register('phone')}
              />
            </fieldset>
          </div>
          <div className="flex flex-row justify-between w-full">
            <fieldset className="w-3/4">
              <label className="inline-block uppercase text-blueGray-700 text-xs font-bold mb-2 ml-1">
                Street Address
              </label>
              <Input
                type="text"
                placeholder="Address"
                errorMessage={<span className="text-red-500">{errors?.streetAddress?.message}</span>}
                errorMessageShowing={!!errors.streetAddress}
                {...register('streetAddress')}
              />
            </fieldset>
            <fieldset className="w-1/4">
              <label className="inline-block uppercase text-blueGray-700 text-xs font-bold mb-2 ml-1">
                PostCode/Zip
              </label>
              <Input
                type="text"
                placeholder="Post/Zip code"
                errorMessage={<span className="text-red-500">{errors?.postcode?.message}</span>}
                errorMessageShowing={!!errors.postcode}
                {...register('postcode')}
              />
            </fieldset>
          </div>
          <div className="flex flex-row justify-between w-full">
            <fieldset className="flex-1">
              <label className="inline-block uppercase text-blueGray-700 text-xs font-bold mb-2 ml-1">
                Apt, Suite, etc.
              </label>
              <Input
                type="text"
                placeholder="Apt, Suite, etc."
                errorMessage={<span className="text-red-500">{errors?.apt?.message}</span>}
                errorMessageShowing={!!errors.apt}
                {...register('apt')}
              />
            </fieldset>
            <fieldset className="flex-1 mx-4">
              <label className="inline-block uppercase text-blueGray-700 text-xs font-bold mb-2 ml-1">City</label>
              <Input
                type="text"
                placeholder="City"
                errorMessage={<span className="text-red-500">{errors?.city?.message}</span>}
                errorMessageShowing={!!errors.city}
                {...register('city')}
              />
            </fieldset>
            <fieldset className="flex-1">
              <label className="inline-block uppercase text-blueGray-700 text-xs font-bold mb-2 ml-1">Country</label>
              <Input
                type="text"
                placeholder="Country"
                errorMessage={<span className="text-red-500">{errors?.country?.message}</span>}
                errorMessageShowing={!!errors.country}
                {...register('country')}
              />
            </fieldset>
          </div>

          <button
            type="submit"
            className={`my-6 py-4 px-2 text-white bg-black rounded-full ${
              sortedProduct.length === 0 ? 'cursor-default bg-[#626262]' : ''
            }`}
            disabled={sortedProduct.length === 0}
          >
            Order Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;

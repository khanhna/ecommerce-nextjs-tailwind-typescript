import type { NextPage } from 'next';
import Link from 'next/link';
import { useController, useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast, { Toaster } from 'react-hot-toast';
import CommonHeading from '@Components/Heading/CommonHeading';
import { FaEnvelopeOpenText, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaUserCircle } from 'react-icons/fa';
import Input from '@Components/Elements/Input';

type ContactRequest = {
  name: string;
  email: string;
  message: string;
};

const schema = yup.object().shape({
  name: yup.string().required('Let us know your name!'),
  email: yup.string().email('An email was necessary'),
  message: yup.string().required('what could we help ?'),
});

const Contact: NextPage = () => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ContactRequest>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', message: '' },
  });
  const { field: messageField, fieldState: messageFieldState } = useController({ name: 'message', control: control });

  const onSubmit: SubmitHandler<ContactRequest> = (source) => {
    toast.success('Form submitted success, we can see form data on console!', { duration: 1000 });
    console.log('This is the form data:', source);
    reset();
  };
  const onInvalidForm: SubmitErrorHandler<ContactRequest> = (errors) =>
    console.log('This is form invalid state:', errors);

  return (
    <div className="site-container">
      <Toaster />
      <h3 className="mt-3 mb-1 text-4xl font-bold">Contact Us</h3>
      <hr className="my-4" />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center p-4">
          <div className="flex items-center justify-center h-32 w-32 rounded-full bg-rose-500 bg-opacity-[0.85]">
            <FaEnvelopeOpenText size={52} className="text-white" />
          </div>
          <CommonHeading
            titleAs="h6"
            titleSize="text-2xl"
            title="Email"
            description="support@veclan.com"
            descriptionColor="text-blueGray-700"
            alignment="center"
          />
        </div>
        <div className="w-full h-full flex flex-col items-center p-4">
          <div className="flex items-center justify-center h-32 w-32 rounded-full bg-rose-500 bg-opacity-[0.85]">
            <FaPhone size={52} className="text-white" />
          </div>
          <CommonHeading
            titleAs="h6"
            titleSize="text-2xl"
            title="Phone"
            description="0086-24-81206685"
            descriptionColor="text-blueGray-700"
            alignment="center"
          />
        </div>
        <div className="w-full h-full flex flex-col items-center p-4">
          <div className="flex items-center justify-center h-32 w-32 rounded-full bg-rose-500 bg-opacity-[0.85]">
            <FaMapMarkerAlt size={52} className="text-white" />
          </div>
          <CommonHeading
            titleAs="h6"
            titleSize="text-2xl"
            title="Phone"
            description="No.26, Zhongxing Street, Heping District, Shenyang, Liaoning, China"
            descriptionColor="text-blueGray-700"
            alignment="center"
          />
        </div>
        <div className="w-full h-full flex flex-col items-center p-4">
          <div className="flex items-center justify-center h-32 w-32 rounded-full bg-rose-500 bg-opacity-[0.85]">
            <FaFacebook size={52} className="text-white" />
          </div>
          <Link href="https://www.facebook.com/groups/52vecn/" passHref>
            <a target="_blank">
              <CommonHeading titleAs="h6" titleSize="text-2xl" title="Facebook" alignment="center" />
            </a>
          </Link>
        </div>
        <div className="w-full h-full flex flex-col items-center p-4">
          <div className="flex items-center justify-center h-32 w-32 rounded-full bg-rose-500 bg-opacity-[0.85]">
            <FaTwitter size={52} className="text-white" />
          </div>
          <Link href="https://twitter.com/veclancom/" passHref>
            <a target="_blank">
              <CommonHeading titleAs="h6" titleSize="text-2xl" title="Twitter" alignment="center" />
            </a>
          </Link>
        </div>
      </div>
      <h3 className="mt-20 mb-1 text-4xl font-bold">Leave a message</h3>
      <hr className="my-4" />
      <form
        className="flex flex-col my-4 w-full rounded-lg bg-white shadow-lg"
        onSubmit={handleSubmit(onSubmit, onInvalidForm)}
      >
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 px-4 pb-4">
            <label className="text-xs uppercase font-bold text-blueGray-700 mb-2 ml-1">Your name</label>
            <Input
              type="text"
              placeholder="Full Name"
              errorMessage={<span className="text-red-500">{errors?.name?.message}</span>}
              errorMessageShowing={!!errors.name}
              leftIcon={
                <span className="z-10 absolute flex items-center text-center w-8 pl-3 text-blueGray-300 text-sm h-full">
                  <FaUserCircle />
                </span>
              }
              {...register('name')}
            />
          </div>
          <div className="w-full md:w-1/2 px-4 pb-4">
            <label className="text-xs uppercase font-bold text-blueGray-700 mb-2 ml-1">Email</label>
            <Input
              type="text"
              placeholder="Email"
              errorMessage={<span className="text-red-500">{errors?.email?.message}</span>}
              errorMessageShowing={!!errors.email}
              leftIcon={
                <span className="z-10 absolute flex items-center text-center w-8 pl-3 text-blueGray-300 text-sm h-full">
                  <FaEnvelopeOpenText />
                </span>
              }
              {...register('email')}
            />
          </div>
        </div>
        <div className="w-full px-4 pb-4">
          <label className="text-xs uppercase font-bold text-blueGray-700 mb-2 ml-1">Message</label>
          <Input
            type="textarea"
            placeholder="Message"
            errorMessage={<span className="text-red-500">{messageFieldState.error?.message}</span>}
            errorMessageShowing={!!messageFieldState.error}
            rows={4}
            cols={80}
            {...messageField}
          />
        </div>
        <div className="w-full text-right">
          <button
            type="submit"
            className="px-4 py-2 mx-4 mb-8 rounded-lg font-bold text-sm uppercase text-white bg-black hover:bg-opacity-75 transition-colors"
          >
            Contact Us
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;

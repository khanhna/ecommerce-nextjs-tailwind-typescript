import { forwardRef, ReactNode, HTMLInputTypeAttribute } from 'react';

type RootProps = {
  textAlign?: 'left' | 'center' | 'right';
  border?: 'border' | 'borderless';
  size?: 'sm' | 'lg' | 'regular';
  leftIcon?: string | ReactNode;
  rightIcon?: string | ReactNode;
  errorMessage?: ReactNode;
  errorMessageShowing?: boolean;
};

type Props = RootProps &
  Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'border' | 'size' | 'type'
  > & { type: ('textarea' | HTMLInputTypeAttribute) | undefined; rows?: number | undefined; cols?: number | undefined };

const textAligns = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const sizes = {
  sm: 'px-2 py-2 text-sm ',
  lg: 'px-3 py-3 text-sm ',
  regular: 'px-3 py-2 text-sm ',
};

const borders = {
  border: 'border-blueGray-300',
  borderless: 'border-transparent shadow',
};

const Input = forwardRef(
  (
    {
      textAlign = 'left',
      border = 'border',
      size = 'regular',
      leftIcon,
      rightIcon,
      type,
      errorMessage,
      errorMessageShowing,
      ...rest
    }: Props,
    ref,
  ) => {
    let inputClasses = `${errorMessageShowing ? 'border-red-500' : borders[border]} ${sizes[size]} ${
      textAligns[textAlign]
    } w-full placeholder-blueGray-200 text-blueGray-700 relative bg-white rounded-md outline-none focus:ring focus:ring-lightBlue-500 focus:ring-1 focus:border-lightBlue-500 border border-solid transition duration-200`;
    let leftAddon = null;
    let rightAddon = null;
    let wrapperClasses = `${errorMessageShowing ? '' : 'mb-3'} pt-0`;

    if (leftIcon) {
      inputClasses += ' pl-10 ';
      wrapperClasses = `relative flex w-full flex-wrap items-stretch ${errorMessageShowing ? '' : 'mb-3'}`;
      if (typeof leftIcon === 'string') {
        leftAddon = (
          <span className="z-10 h-full flex absolute text-center text-blueGray-300 text-sm items-center w-8 pl-3">
            <i className={leftIcon}></i>
          </span>
        );
      } else {
        leftAddon = leftIcon;
      }
    }
    if (rightIcon) {
      inputClasses = inputClasses + ' pr-10 ';
      wrapperClasses = `relative flex w-full flex-wrap items-stretch ${errorMessageShowing ? '' : 'mb-3'}`;
      if (typeof rightIcon === 'string') {
        rightAddon = (
          <span className="z-10 h-full flex absolute text-center text-blueGray-300 text-sm items-center w-8 right-0">
            <i className={rightIcon}></i>
          </span>
        );
      } else {
        rightAddon = rightIcon;
      }
    }
    return (
      <>
        <div className={wrapperClasses}>
          {leftAddon}
          {type && type === 'textarea' ? (
            <textarea {...(rest as any)} className={inputClasses} />
          ) : (
            <input {...rest} type={type} className={inputClasses} ref={ref as any} />
          )}
          {rightAddon}
        </div>
        {errorMessage}
      </>
    );
  },
);

export default Input;

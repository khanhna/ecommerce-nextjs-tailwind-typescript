import { forwardRef } from 'react';

type Props = {
  id: string;
  name?: string;
  value: string | number;
  labelName: string;
  className?: string | undefined;
};

const InputRadio = forwardRef(({ id, name, value, labelName, className, ...rest }: Props, ref) => (
  <div className={className}>
    <input
      type="radio"
      name={name}
      value={value}
      id={id}
      className="absolute w-0 h-0 hidden"
      {...rest}
      ref={ref as any}
    />
    <label htmlFor={id} className="relative inline-block pl-7 leading-5 cursor-pointer">
      <div className="absolute left-0 top-0 w-5 h-5 border solid border-black bg-white rounded-[100%]" />
      {labelName}
      <div className="absolute left-1 top-1 w-3 h-3 rounded-[100%] bg-black transition-all duration-200" />
    </label>
  </div>
));

export default InputRadio;

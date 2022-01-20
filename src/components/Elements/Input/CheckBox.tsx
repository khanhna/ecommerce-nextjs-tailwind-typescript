import { forwardRef } from 'react';

type Props = {
  id: string;
  name?: string;
  value: string | number;
  labelName: string;
  size?: number;
  className?: string | undefined;
};

const InputCheckBox = forwardRef(({ id, name, value, labelName, size = 18, className, ...rest }: Props, ref) => (
  <div className={className}>
    <input
      type="checkbox"
      name={name}
      value={value}
      id={id}
      className="absolute w-0 h-0 hidden"
      {...rest}
      ref={ref as any}
    />
    <label htmlFor={id} className="flex cursor-pointer overflow-hidden transition-all duration-200">
      <span
        className="align-middle relative rounded border-2 border-slate-500 scale-100 transition-all duration-200"
        style={{
          display: 'flex',
          flex: `0 0 ${size}px`,
          width: `${size}px`,
          height: `${size}px`,
          transform: 'translate3d(0,0,0)',
        }}
      >
        <svg
          className="absolute fill-[none] stroke-white [stroke-dashoffset:16px] transition-all duration-200"
          style={{
            width: `${Math.floor((size * 2) / 3)}px`,
            height: `${Math.floor((size * 5) / 9)}px`,
            left: '10%',
            top: '22%',
            strokeDasharray: '16px',
          }}
        >
          <use xlinkHref="#check" />
        </svg>
      </span>
      <span className="pl-2" style={{ lineHeight: `${size}px` }}>
        {labelName}
      </span>
    </label>
  </div>
));

export default InputCheckBox;

import { FC } from 'react';

type Props = {
  size?: number;
};

const Loading: FC<Props> = ({ size = 16 }) => (
  <div className="w-full h-full flex items-center justify-center">
    <div
      className="border-rose-400 border-t-transparent border-solid rounded-full animate-spin"
      style={{ width: `${size}px`, height: `${size}px`, borderWidth: Math.floor(size / 10 + 1) }}
    />
  </div>
);

export default Loading;

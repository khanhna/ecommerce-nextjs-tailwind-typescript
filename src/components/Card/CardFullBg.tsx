import { FC } from 'react';
import Link from 'next/link';

type LinkProps = {
  to: string;
  isOutside?: boolean;
};

export type Props = {
  image: string;
  title: string;
  subTitle?: string;
  rounded?: boolean;
  link: LinkProps;
  size?: 'sm' | 'lg' | 'md';
};

const sizes = {
  sm: 'h-[320px]',
  md: 'h-[420px]',
  lg: 'h-[520px]',
};

const CardFullBg: FC<Props> = ({ image, title, subTitle, rounded = true, link, size = 'md' }) => {
  return (
    <div
      className={`${
        sizes[size]
      } group overflow-hidden relative flex flex-col break-words w-full mb-4 shadow-lg transition-all ease-in-out hover:scale-110 ${
        rounded ? 'rounded-lg' : ''
      }`}
    >
      <div
        className={`absolute inset-0 bg-50-center bg-cover transition-all duration-1000 ease-in-out group-hover:scale-110 ${
          rounded ? 'rounded-lg' : ''
        }`}
        style={{ backgroundImage: `url('${image}')`, backfaceVisibility: 'hidden' }}
      />
      <div className={`absolute inset-0 bg-black opacity-50 ${rounded ? 'rounded-lg' : ''}`} />
      <div className="absolute text-left p-6 bottom-0 text-ellipsis">
        <h6 className="text-xl leading-normal mb-0 text-white opacity-75">{subTitle}</h6>
        <h5 className="text-2xl leading-tight font-bold mt-0 mb-2 text-white">{title}</h5>
      </div>
      {link && link.to && (
        <Link href={link.to} passHref>
          <a target={link.isOutside ? '_blank' : undefined}>
            <div className="absolute inset-0" />
          </a>
        </Link>
      )}
    </div>
  );
};

export default CardFullBg;

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  imageUrl: string;
  category?: string;
  title: string;
  description?: string;
  price?: string;
  productUrl?: string;
};

const CardProduct: FC<Props> = ({ imageUrl, category, title, description = '', price = '', productUrl = '#' }) => {
  return (
    <Link href={productUrl} passHref>
      <a className="flex flex-col break-words bg-white w-full mb-6 rounded-lg hover:shadow-lg transition-shadow">
        <div className="p-6">
          <Image src={imageUrl} alt={title} height="256px" width="256px" layout="responsive" objectFit="contain" />
        </div>
        <div className="p-6 flex-auto">
          {category && <h6 className="text-sm font-bold uppercase mb-1 text-rose-500">{category}</h6>}
          <h5 className="text-2xl font-semibold mb-2">{title}</h5>
          <p className="text-blueGray-500 leading-relaxed text-ellipsis overflow-y-hidden">
            {description.length > 150 ? description.slice(0, 150) + '...' : description}
          </p>
          <span className="text-blueGray-700 text-xl mt-1">{`${price}`}</span>
        </div>
      </a>
    </Link>
  );
};

export default CardProduct;

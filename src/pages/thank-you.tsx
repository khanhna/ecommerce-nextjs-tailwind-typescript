import { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';

const ThankyouPage: NextPage = () => {
  return (
    <div className="site-container text-center">
      <h1 className="mt-20 uppercase text-[6.25rem] leading-[1.1] font-bold">THANK YOU!</h1>

      <div className="mx-auto my-8 relative w-48 h-48">
        <Image src="/images/Leekachu.jpg" alt="Leekachu" layout="fill" objectFit="cover" />
      </div>
      <p className="m-6 text-xl">
        Congratulations for complete following along the way.
        <br />
        <br />
        It would be so nice if you also interesting in some kind of headphone, a tour around{' '}
        <Link href="https://www.veclan.com/" passHref>
          <a className="font-medium text-rose-400 hover:text-gray-600 transition-colors duration-200" target="_blank">
            Real website
          </a>
        </Link>
        {', '}
        <Link href="https://www.facebook.com/groups/52vecn/" passHref>
          <a className="font-medium text-rose-400 hover:text-gray-600 transition-colors duration-200" target="_blank">
            Facebook group
          </a>
        </Link>
        {', or '}
        <Link href="https://www.youtube.com/c/WildLee/" passHref>
          <a className="font-medium text-rose-400 hover:text-gray-600 transition-colors duration-200" target="_blank">
            Youtube channel
          </a>
        </Link>{' '}
        would make us all and PikaLee happy &#60;3.
        <br />
        <br />
        Happy coding!
      </p>
    </div>
  );
};

export default ThankyouPage;

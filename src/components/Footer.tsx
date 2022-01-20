import { FC } from 'react';
import Link from 'next/link';
import { FaFacebookSquare, FaLinkedin, FaGithub, FaGoogle, FaRegHeart } from 'react-icons/fa';

const Footer: FC = () => (
  <footer className="bg-blueGray-50 mt-auto">
    <div className="container mx-auto px-4 pt-8 pb-6">
      <div className="flex flex-wrap text-left">
        <div className="flex-grow-[9] px-4">
          <h4 className="text-xl font-bold mt-4">A VEClan member!</h4>
          <h5 className="mt-1 mb-2 text-blueGray-500">I&lsquo;m avaible at</h5>
          <div className="mt-2 mb-6 md:mb-0">
            <Link href="https://www.facebook.com/Khanh.nguyen.1699/" passHref>
              <a
                target="_blank"
                type="button"
                className="bg-white text-facebook-regular shadow-lg font-normal h-10 w-10 inline-flex items-center justify-center rounded-full outline-none mr-2"
              >
                <FaFacebookSquare />
              </a>
            </Link>
            <Link href="https://www.linkedin.com/in/nguy%E1%BB%85n-kh%C3%A1nh-748476122/" passHref>
              <a
                target="_blank"
                type="button"
                className="bg-white text-facebook-regular shadow-lg font-normal h-10 w-10 inline-flex items-center justify-center rounded-full outline-none mr-2"
              >
                <FaLinkedin />
              </a>
            </Link>
            <Link href="https://github.com/khanhna/" passHref>
              <a
                target="_blank"
                type="button"
                className="bg-white text-facebook-regular shadow-lg font-normal h-10 w-10 inline-flex items-center justify-center rounded-full outline-none mr-2"
              >
                <FaGithub />
              </a>
            </Link>
            <Link href="mailto:khanhnguyen1699@gmail.com" passHref>
              <a
                target="_blank"
                type="button"
                className="bg-white text-facebook-regular shadow-lg font-normal h-10 w-10 inline-flex items-center justify-center rounded-full outline-none mr-2"
              >
                <FaGoogle />
              </a>
            </Link>
          </div>
        </div>
        <div className="flex-grow-[3] px-4 mt-4">
          <span className="block uppercase text-xs font-bold mb-2">About true VE</span>
          <ul className="list-none">
            <li>
              <Link href="https://www.veclan.com/" passHref>
                <a target="_blank" className="text-blueGray-500 hover:text-blueGray-700 transition-colors">
                  Website
                </a>
              </Link>
            </li>
            <li>
              <Link href="https://www.youtube.com/c/WildLee/" passHref>
                <a target="_blank" className="text-blueGray-500 hover:text-blueGray-700 transition-colors">
                  Youtube Channel
                </a>
              </Link>
            </li>
            <li>
              <Link href="https://www.facebook.com/groups/52vecn/" passHref>
                <a target="_blank" className="text-blueGray-500 hover:text-blueGray-700 transition-colors">
                  Facebook Group
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <hr className="bg-blueGray-200" />
    <div className="w-full inline-flex items-center justify-center h-16">
      <span className="inline-flex">
        Made by&nbsp;
        <Link href="https://gordonkhanhnguyen.dev/" passHref>
          <a target="_blank" className="text-blueGray-500 hover:text-blueGray-700">
            Gordon Khanh Ng.
          </a>
        </Link>
        &nbsp;with &nbsp; <FaRegHeart className="translate-y-1" />
      </span>
    </div>
  </footer>
);

export default Footer;

/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination } from 'swiper';
import { homeBanner } from '@Data/products';
import CommonHeading from '@Components/Heading/CommonHeading';
import CardFullBg from '@Components/Card/CardFullBg';
import homeNotices, { HomeNoticeProps } from '@Data/homeNotice';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

SwiperCore.use([Autoplay, Pagination]);

const candidateDescription = () => (
  <p>
    I was just like the most of audio-noobs, until I ordered my first{' '}
    <Link href="https://www.veclan.com/engappliance_sel_one?eng_ApplianceVo.eac_id=3" passHref>
      <a target="_blank" className="text-rose-400">
        Zen 2.0
      </a>
    </Link>
    (luckily, mine was SLQ version (XD))
    <br />
    Well then... All hail Chinese Shaman!
  </p>
);

// Pretending like we fetch data form server here!
export const getStaticProps: GetStaticProps = () => ({
  props: {
    banners: homeBanner,
    noticeCategories: homeNotices,
  },
});

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ banners, noticeCategories }) => {
  return (
    <div>
      <Swiper
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        speed={600}
        className="site-container [--swiper-theme-color:#f43f5e]"
      >
        {banners.map(({ imageUrl, productUrl, alt }: typeof homeBanner[0], idx: any) => (
          <SwiperSlide key={idx}>
            <Link href={productUrl} passHref>
              <a>
                <img src={imageUrl} alt={alt} />
              </a>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="site-container mt-12">
        <div className="mb-6">
          <CommonHeading
            titleAs="h3"
            title="Meet our candidates"
            description={candidateDescription()}
            alignment="center"
          />
        </div>
        <div className="flex flex-wrap">
          {noticeCategories.map((item: HomeNoticeProps) => (
            <div key={item.title} className={`px-4 mb-4 relative w-full ${item.lgScreenWidth}`}>
              <CardFullBg image={item.image} link={item.link} title={item.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

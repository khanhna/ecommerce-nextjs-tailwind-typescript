import type { Props as CardProp } from '@Components/Card/CardFullBg';
import { ROUTE_PRODUCT_LIST_PREFIX } from './products';

export type HomeNoticeProps = CardProp & {
  lgScreenWidth: 'md:w-1/4' | 'md:w-1/2';
};

const homeNotices: HomeNoticeProps[] = [
  {
    image: '/images/home-notices/001_earbud.jpg',
    link: { to: `${ROUTE_PRODUCT_LIST_PREFIX}?category=earbuds` },
    title: 'Earbud',
    lgScreenWidth: 'md:w-1/4',
  },
  {
    image: '/images/home-notices/002_monk_slim_metal.jpg',
    link: { to: `${ROUTE_PRODUCT_LIST_PREFIX}/monk-slim-metal` },
    title: 'Slim Metal',
    lgScreenWidth: 'md:w-1/4',
  },
  {
    image: '/images/home-notices/006_in_ear.jpg',
    link: { to: `${ROUTE_PRODUCT_LIST_PREFIX}?category=in-ear` },
    title: 'In-Ear',
    lgScreenWidth: 'md:w-1/2',
  },
  {
    image: '/images/home-notices/003_defiant.jpg',
    link: { to: `${ROUTE_PRODUCT_LIST_PREFIX}?category=dac-amp` },
    title: 'Amplifier',
    lgScreenWidth: 'md:w-1/2',
  },
  {
    image: '/images/home-notices/004_cable.jpg',
    link: { to: `${ROUTE_PRODUCT_LIST_PREFIX}?category=cables` },
    title: 'Cable',
    lgScreenWidth: 'md:w-1/4',
  },
  {
    image: '/images/home-notices/005_customize_cable.jpg',
    link: { to: `${ROUTE_PRODUCT_LIST_PREFIX}/customize-cable` },
    title: 'Customize Cable',
    lgScreenWidth: 'md:w-1/4',
  },
];

export default homeNotices;

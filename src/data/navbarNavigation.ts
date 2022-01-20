export type NavigationItem = {
  name: string;
  link?: string;
  collapse?: NavigationItem[];
};

const navigationItems: NavigationItem[] = [
  {
    name: 'About',
    link: '/about',
  },
  {
    name: 'Product',
    link: '/products',
    collapse: [
      {
        name: 'Accessories',
        link: '?category=accessories',
        collapse: [
          {
            name: 'EXPack4OE',
            link: '/products/ex-pack-4oe',
          },
          {
            name: 'Ex pack',
            link: '/products/ex-pack',
          },
        ],
      },
      {
        name: 'Cables',
        link: '?category=cables',
        collapse: [
          {
            name: 'Adapter Cables',
            link: '/products/adapter-cable',
          },
          {
            name: 'Basic DI copper lite',
            link: '/products/copper-lite-cable',
          },
          {
            name: 'Customized Cable',
            link: '/products/customize-cable',
          },
          {
            name: 'Premium Silver Plated Copper',
            link: '/products/premium-silver-plated-copper-cable',
          },
          {
            name: 'Standard DI Copper',
            link: '/products/standard-copper-cable',
          },
          {
            name: 'Ultra budget cables',
            link: '/products/ultra-budget-cable',
          },
        ],
      },
      {
        name: 'Dac&amp',
        link: '?category=dac-amp',
        collapse: [
          {
            name: 'Defiant',
            link: '/products/defiant',
          },
          {
            name: 'Enterprise E Lite',
            link: '/products/enterprise-e-lite',
          },
          {
            name: 'Megatron',
            link: '/products/megatron',
          },
          {
            name: 'RA PLUS 5th',
            link: '/products/ra-plus-5th',
          },
        ],
      },
      {
        name: 'Earbuds',
        link: '?category=earbuds',
        collapse: [
          {
            name: 'Asura 3.0FE',
            link: '/products/asura-30',
          },
          {
            name: 'MOE',
            link: '/products/moe',
          },
          {
            name: 'Monk lite',
            link: '/products/monk-lite',
          },
          {
            name: 'Monk plus',
            link: '/products/monk-plus',
          },
          {
            name: 'Monk slim metal',
            link: '/products/monk-slim-metal',
          },
          {
            name: 'Monk go',
            link: '/products/monk-go',
          },
          {
            name: 'Sun',
            link: '/products/sun',
          },
          {
            name: 'Zen 2.0',
            link: '/products/zen-20',
          },
          {
            name: 'Zen LL',
            link: '/products/zen-ll',
          },
        ],
      },
      {
        name: 'In-ear',
        link: '?category=in-ear',
        collapse: [
          {
            name: 'BIE Pro',
            link: '/products/bie-pro',
          },
          {
            name: 'Bonus IE',
            link: '/products/bonus-ie',
          },
          {
            name: 'Grand Duke',
            link: '/products/grand-duke',
          },
        ],
      },
      {
        name: 'Not By VE',
        link: '?category=not-by-ve',
        collapse: [
          {
            name: 'Abigail',
            link: '/products/abigail',
          },
          {
            name: 'Avani',
            link: '/products/avani',
          },
        ],
      },
    ],
  },
  {
    name: 'Contact',
    link: '/contact',
  },
];

export default navigationItems;

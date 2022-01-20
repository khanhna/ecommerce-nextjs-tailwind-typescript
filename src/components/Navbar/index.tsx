import { useState, FC, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@State/hook';
import { setDisabledDetectScrollDirection, setScrollDirection as changeScrollDirection } from '@State/navigator';
import { FiMenu, FiShoppingCart } from 'react-icons/fi';
import navigationItems, { NavigationItem } from '@Data/navbarNavigation';
import MobileMenuNav from './MobileMenuNav';
import CartMenu from './CartMenu';

export const MainNavHeight = 56;

const NavigationItemDetail: FC<NavigationItem & { toggleBgOverlay: () => void }> = ({
  name,
  link,
  collapse,
  toggleBgOverlay,
}) => {
  return (
    <li
      className={`group ml-8 first-of-type:ml-0 list-none cursor-pointer hover:text-rose-600 transition-colors duration-300`}
      onMouseEnter={Array.isArray(collapse) ? toggleBgOverlay : undefined}
      onMouseLeave={Array.isArray(collapse) ? toggleBgOverlay : undefined}
    >
      {link ? (
        <Link href={link} passHref>
          <a className="w-full">
            <span className="px-4 py-2">{name}</span>
            <hr className={`mt-2 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
          </a>
        </Link>
      ) : (
        <div className="w-full">
          <span className="px-4 py-2">{name}</span>
          <hr className={`mt-2 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
        </div>
      )}

      {Array.isArray(collapse) && (
        <div
          className={`absolute scale-y-0 left-0 right-0 pb-8 bg-white cursor-default group-hover:scale-y-100 transition-transform duration-300 [transform-origin:_top_center;]`}
        >
          <div className="flex flex-wrap justify-center pt-8 px-16">
            <div className="flex items-start">
              {collapse.map((subItem, idx) => (
                <div key={`title_${subItem.name}_${idx}`} className="flex flex-col ml-12 first-of-type:ml-0">
                  {subItem.link ? (
                    <Link href={link + subItem.link} passHref>
                      <a className="text-black text-lg mb-4 cursor-pointer hover:text-rose-600 transition-colors duration-300">
                        {subItem.name}
                      </a>
                    </Link>
                  ) : (
                    <span className="text-black text-lg mb-4 cursor-pointer hover:text-rose-600 transition-colors duration-300">
                      {subItem.name}
                    </span>
                  )}

                  {Array.isArray(subItem.collapse) && (
                    <div key={`${subItem.name}_${idx}`} className="flex flex-col">
                      {subItem.collapse.map((childItem, ctIdx) => (
                        <Link
                          key={`detail_${childItem.name}_${ctIdx}`}
                          href={childItem.link ? childItem.link : '#'}
                          passHref
                        >
                          <a className="list-none mb-1 cursor-pointer text-gray-500 hover:text-rose-600 transition-colors duration-300">
                            {childItem.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartMenuOpen, setCartMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [navbarShadow, setNavbarShadow] = useState(false);
  const [showBackgroundOverlay, setShowBackgroundOverlay] = useState(false);
  const { disabledScrollDirectionDetectionMs, scrollDirection: generalDirection } = useAppSelector(
    (state) => state.navigator,
  );
  const cart = useAppSelector((state) => state.appPersist.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!disabledScrollDirectionDetectionMs) return;

    const timeoutToRemove = setTimeout(() => {
      dispatch(setDisabledDetectScrollDirection({ period: undefined }));
      setScrollDirection('up');
      dispatch(changeScrollDirection({ direction: 'up' }));
    }, disabledScrollDirectionDetectionMs + 50);

    return () => clearTimeout(timeoutToRemove);
  }, [disabledScrollDirectionDetectionMs]);

  useEffect(() => {
    if (disabledScrollDirectionDetectionMs) return;
    const threshold = 0;
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        setNavbarShadow(window.scrollY > 0 && scrollDirection === 'up');

        if (generalDirection !== scrollDirection) {
          dispatch(changeScrollDirection({ direction: scrollDirection }));
        }
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [disabledScrollDirectionDetectionMs, scrollDirection, generalDirection]);

  return (
    <>
      <div>
        <nav
          id="site-nav-bar"
          className={`z-20 fixed top-0 ${generalDirection === 'up' ? 'translate-y-0' : '-translate-y-14'} ${
            navbarShadow ? 'shadow-sm' : ''
          } h-14 w-full bg-white transition-all`}
        >
          <div className="site-container py-3 flex flex-row items-center justify-between">
            <Link href="/" passHref>
              <a className="inline-flex items-center cursor-pointer">
                <Image src="/images/logos/Venture_logo.png" alt="logo" width={36} height={36} objectFit="contain" />
                <span className="ml-2">Venture electronic</span>
              </a>
            </Link>
            <ul className="hidden md:flex md:flex-wrap md:items-center mt-1">
              {navigationItems.map((x, idx) => (
                <NavigationItemDetail
                  key={`nav_wrapper_${x.name}_${idx}`}
                  name={x.name}
                  link={x.link}
                  collapse={x.collapse}
                  toggleBgOverlay={() => setShowBackgroundOverlay((prev) => !prev)}
                />
              ))}
            </ul>
            <div className="flex flex-row items-center">
              <button className="p-2 relative" onClick={() => setCartMenuOpen((prev) => !prev)}>
                <FiShoppingCart size={18} />
                {cart.products.length > 0 && (
                  <span className="absolute top-0 right-0 px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {cart.products.length}
                  </span>
                )}
              </button>
              <FiMenu size={18} className="md:hidden ml-4 cursor-pointer" onClick={() => setMobileMenuOpen(true)} />
            </div>
          </div>
          <MobileMenuNav isOpen={mobileMenuOpen} toggleMenu={() => setMobileMenuOpen((prev) => !prev)} />
          <CartMenu isOpen={cartMenuOpen} toggleMenu={() => setCartMenuOpen((prev) => !prev)} />
        </nav>
      </div>
      {/* Offset fixed top navbar */}
      <div
        className={`h-14 ${
          generalDirection === 'up' ? 'scale-y-100' : 'scale-y-0'
        } transition-transform [transform-origin:_top_center;]`}
      />
      <div
        className={`fixed inset-0 bg-site-overlay backdrop-blur-sm transition-opacity duration-200 ${
          showBackgroundOverlay ? 'opacity-90 z-10' : 'opacity-0 z-[-1]'
        }`}
      />
    </>
  );
}

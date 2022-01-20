/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC, Fragment, useState } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import navigationItems from '@Data/navbarNavigation';

const secondLayer = navigationItems
  .map((item) => ({
    ...item,
    collapse: item.collapse?.map((x) => ({ ...x, link: (item.link || '') + x.link, parentMenu: item.name })),
  }))
  .filter((x) => x.collapse);

const thirdLayer = secondLayer
  .map((x) => x.collapse)
  .flat()
  .filter((x) => x?.collapse);

const MobileMenuNav: FC<{ isOpen: boolean; toggleMenu: () => void }> = ({ isOpen, toggleMenu }) => {
  const [displayStack, setDisplayStack] = useState<string[]>([]);

  const handleDrillDown = (target: string, depth: number) => {
    let filterResult = [];
    switch (depth) {
      case 1:
        filterResult = secondLayer.filter((x) => x.name === target);
        break;
      case 2:
        filterResult = thirdLayer.filter((x) => x?.name === target);
        break;
      default:
        break;
    }

    if (filterResult.length !== 0) {
      setDisplayStack((prev) => [...prev, target]);
    }
  };
  const handleDrillUp = () => setDisplayStack((prev) => prev.slice(0, prev.length - 1));
  const handleCloseMobileMenu = () => {
    setDisplayStack([]);
    toggleMenu();
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="z-20 fixed inset-0 overflow-hidden" onClose={handleCloseMobileMenu}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-site-overlay opacity-90 backdrop-blur-sm" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-300"
            enterFrom="translate-x-[300px]"
            enterTo="translate-x-0"
            leave="transition-transform duration-300"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[300px]"
          >
            <div className="absolute top-0 right-0 overflow-x-hidden h-full w-mobile-nav bg-white">
              <div
                className={`absolute left-0 right-0 w-mobile-nav ${
                  displayStack.length > 0 ? '-translate-x-mobile-nav' : 'translate-x-0'
                } transition-transform duration-300`}
              >
                <div className="flex items-center justify-between mb-2 py-6 px-4 border-b">
                  <button
                    className="inline-flex items-center pl-2 pr-4 py-2 rounded-3xl hover:bg-slate-200 transition-colors duration-300"
                    onClick={handleCloseMobileMenu}
                  >
                    <IoChevronBack size={16} />
                    <span>Back</span>
                  </button>
                  <span className="text-lg font-medium text-gray-800">Menu</span>
                </div>
                {navigationItems.map((item, idx) => (
                  <Fragment key={`first_lv_${item.name}_${idx}`}>
                    {item.collapse ? (
                      <button
                        className="inline-flex items-center justify-between w-full pl-4 pr-2 py-1 cursor-pointer hover:text-rose-500 transition-colors duration-300"
                        onClick={() => handleDrillDown(item.name, 1)}
                      >
                        <span>{item.name}</span>
                        {item.collapse && <IoChevronForward size={16} />}
                      </button>
                    ) : (
                      <>
                        {item.link ? (
                          <Link href={item!.link} passHref>
                            <a
                              className="inline-flex items-center justify-between w-full pl-4 pr-2 py-1 cursor-pointer hover:text-rose-500 transition-colors duration-300"
                              onClick={handleCloseMobileMenu}
                            >
                              {item!.name}
                            </a>
                          </Link>
                        ) : (
                          <span className="text-lg font-medium text-gray-800">{item!.name}</span>
                        )}
                      </>
                    )}
                  </Fragment>
                ))}
              </div>

              {secondLayer.map((item, idx) => (
                <div
                  key={`first_lv_nest_${item.name}_${idx}`}
                  className={`absolute w-mobile-nav left-mobile-nav ${
                    displayStack[displayStack.length - 2] === item.name
                      ? '-translate-x-2-mobile-nav'
                      : displayStack[displayStack.length - 1] === item.name
                      ? '-translate-x-mobile-nav'
                      : 'translate-x-0'
                  } transition-transform duration-300`}
                >
                  <div className="flex items-center justify-between mb-2 py-6 px-4 border-b">
                    <div
                      className="inline-flex items-center cursor-pointer pl-2 pr-4 py-2 rounded-3xl hover:bg-slate-200 transition-colors duration-300"
                      onClick={handleDrillUp}
                    >
                      <IoChevronBack size={16} />
                      <span>Menu</span>
                    </div>
                    {item.link ? (
                      <Link href={item.link} passHref>
                        <a className="text-lg font-medium text-gray-800" onClick={handleCloseMobileMenu}>
                          {item.name}
                        </a>
                      </Link>
                    ) : (
                      <span className="text-lg font-medium text-gray-800">{item.name}</span>
                    )}
                  </div>
                  {Array.isArray(item.collapse) && (
                    <>
                      {item.collapse.map((subItem, subIdx) => (
                        <button
                          key={`sec_${subItem.name}_${subIdx}`}
                          className="inline-flex items-center justify-between w-full pl-4 pr-2 py-1 cursor-pointer hover:text-rose-500 transition-colors duration-300"
                          onClick={() => handleDrillDown(subItem.name, 2)}
                        >
                          <span>{subItem.name}</span>
                          {subItem.collapse && <IoChevronForward size={16} />}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              ))}

              {thirdLayer
                .filter((x) => x !== undefined)
                .map((item, idx) => (
                  <div
                    key={`third_lv_${item!.name}_${idx}`}
                    className={`absolute w-mobile-nav left-mobile-nav ${
                      displayStack[displayStack.length - 1] === item!.name ? '-translate-x-mobile-nav' : 'translate-x-0'
                    } transition-transform duration-300`}
                  >
                    <div className="flex items-center justify-between mb-2 py-6 px-4 border-b">
                      <div
                        className="inline-flex items-center cursor-pointer pl-2 pr-4 py-2 rounded-3xl hover:bg-slate-200 transition-colors duration-300"
                        onClick={handleDrillUp}
                      >
                        <IoChevronBack size={16} />
                        <span>{item!.parentMenu}</span>
                      </div>
                      {item!.link ? (
                        <Link href={item!.link} passHref>
                          <a className="text-lg font-medium text-gray-800" onClick={handleCloseMobileMenu}>
                            {item!.name}
                          </a>
                        </Link>
                      ) : (
                        <span className="text-lg font-medium text-gray-800">{item!.name}</span>
                      )}
                    </div>
                    {Array.isArray(item!.collapse) && (
                      <>
                        {item!.collapse.map((subItem, subIdx) => (
                          <Link key={`third_lv_nest_${subItem.name}_${subIdx}`} href={subItem.link || '#'} passHref>
                            <a
                              className="inline-flex items-center justify-between w-full pl-4 pr-2 py-1 cursor-pointer hover:text-rose-500 transition-colors duration-300"
                              onClick={handleCloseMobileMenu}
                            >
                              {subItem.name}
                            </a>
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                ))}
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default MobileMenuNav;

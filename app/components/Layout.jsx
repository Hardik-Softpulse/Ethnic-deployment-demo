import paypal from '../img/paypal.png';
import mastercard from '../img/mastercard.png';
import americanExpress from '../img/american-express.png';
import masestro from '../img/masestro.png';
import visa from '../img/visa.png';
import dinersClub from '../img/diners-club.png';
import logo from '../img/logo.png';
import {useParams, Form, Await, useMatches} from '@remix-run/react';
import {useWindowScroll} from 'react-use';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo} from 'react';
import {CartForm} from '@shopify/hydrogen';
import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
  Heading,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
} from '~/components';
import {useIsHomePath} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';

export function Layout({children, layout}) {
  const {headerMenu, footerMenu} = layout;
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && <Header title={layout.shop.name} menu={headerMenu} />}
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      {footerMenu && <Footer menu={footerMenu} />}
    </>
  );
}

function Header({title, menu}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      {/* <CartDrawer isOpen={isCartOpen} onClose={closeCart} /> */}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}) {
  const [root] = useMatches();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={root.data?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

function DesktopHeader({isHome, menu, title}) {
  const params = useParams();

  return (
    <header className="site-header">
      <div className="promotion-bar text-center">
        <div className="container">Free shipping on order above $20.</div>
      </div>
      <div className="site-logo-nav">
        <div className="container">
          <div className="row flxnwrp">
            <div className="st-col st-nav-icon icx dfx flx-50 visible-x">
              <a href="javascript:void(0)" className="st-nav-ic st-nav-trigger">
                <span></span>
                <span></span>
                <span></span>
              </a>
              <a
                href="javascript:void(0)"
                className="st-nav-ic st-nav-search visible-x"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 12 12"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.18 8.5C6.41 9.92 3.83 9.81 2.19 8.18C0.43 6.42 0.42 3.57 2.18 1.81C3.93 0.05 6.78 0.05 8.54 1.8C10.18 3.44 10.3 6.03 8.88 7.79L11.74 10.64L11.03 11.35L8.18 8.5ZM2.89 2.52C1.52 3.89 1.52 6.1 2.89 7.47C4.26 8.83 6.47 8.83 7.84 7.47L7.85 7.46C9.21 6.09 9.2 3.88 7.84 2.51C6.47 1.15 4.25 1.15 2.89 2.52Z"
                  />
                </svg>
              </a>
            </div>
            <div className="st-col st-nav-menu flx-50 hidden-x">
              <ul className="site-nav">
                {(menu?.items || []).map((item) => (
                  <li key={item.id} prefetch="intent" className="st-nav-li">
                    <a
                      href={item.to}
                      target={item.target}
                      className="st-nav-link"
                    >
                      {' '}
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="st-col st-nav-logo flx-auto">
              <a href="/">
                <img src={logo} />
              </a>
            </div>
            <div className="st-col st-nav-icon dfx flxwrp flxend flx-50">
              <a
                href="javascript:void(0)"
                className="st-nav-ic st-nav-search hidden-x"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 12 12"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.18 8.5C6.41 9.92 3.83 9.81 2.19 8.18C0.43 6.42 0.42 3.57 2.18 1.81C3.93 0.05 6.78 0.05 8.54 1.8C10.18 3.44 10.3 6.03 8.88 7.79L11.74 10.64L11.03 11.35L8.18 8.5ZM2.89 2.52C1.52 3.89 1.52 6.1 2.89 7.47C4.26 8.83 6.47 8.83 7.84 7.47L7.85 7.46C9.21 6.09 9.2 3.88 7.84 2.51C6.47 1.15 4.25 1.15 2.89 2.52Z"
                  />
                </svg>
              </a>
              <a href="account/details" className="st-nav-ic st-nav-user">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 62 72"
                >
                  <path
                    fillRule="evenodd"
                    d="M48 17C48 26.35 40.35 34 31 34C21.65 34 14 26.35 14 17C14 7.65 21.65 0 31 0C40.35 0 48 7.65 48 17ZM20 17C20 23.11 24.89 28 31 28C37.11 28 42 23.11 42 17C42 10.89 37.11 6 31 6C24.89 6 20 10.89 20 17ZM31 43C47.97 43 62 55.89 62 72L56 72C56 59.39 44.96 49 31 49C17.04 49 6 59.39 6 72L0 72C0 55.89 14.03 43 31 43Z"
                  />
                </svg>
              </a>
              <a href="/cart" className="st-nav-ic st-nav-cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="22"
                  viewBox="0 0 88 78"
                >
                  <path d="M69.26 57.15C65.04 57.15 61.23 59.7 59.61 63.61C58 67.51 58.89 72 61.88 74.99C64.87 77.98 69.36 78.87 73.26 77.26C77.17 75.64 79.72 71.83 79.72 67.61C79.72 66.24 79.45 64.88 78.92 63.61C78.39 62.34 77.62 61.19 76.65 60.22C75.68 59.25 74.53 58.48 73.26 57.95C71.99 57.42 70.63 57.15 69.26 57.15L69.26 57.15Z"></path>
                  <path d="M48.27 20.43L80.1 20.43L73.77 46.06L28.49 46.06L17.44 -0.06L0.24 -0.06L0.24 5.94L12.71 5.94L23.75 52.06L78.47 52.06L87.76 14.43L48.27 14.43L48.27 20.43L48.27 20.43Z"></path>
                  <path d="M30.45 57.15C26.22 57.15 22.41 59.69 20.8 63.6C19.18 67.5 20.07 72 23.06 74.99C26.04 77.98 30.54 78.87 34.44 77.26C38.35 75.64 40.9 71.84 40.9 67.61C40.9 66.24 40.63 64.88 40.1 63.61C39.58 62.34 38.81 61.19 37.84 60.22C36.87 59.25 35.72 58.48 34.45 57.95C33.18 57.43 31.82 57.15 30.45 57.15L30.45 57.15Z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function AccountLink({className}) {
  const [root] = useMatches();
  const isLoggedIn = root.data?.isLoggedIn;
  return isLoggedIn ? (
    <Link to="/account" className={className}>
      <IconAccount />
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
      <IconLogin />
    </Link>
  );
}

function CartCount({isHome, openCart}) {
  const [root] = useMatches();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={root.data?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({openCart, dark, count}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark
              ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
              : 'text-contrast bg-primary'
          } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({menu}) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={`grid min-h-[25rem] items-start grid-flow-row w-full gap-6 py-8 px-6 md:px-8 lg:px-12 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsCount}
        bg-primary dark:bg-contrast dark:text-primary text-contrast overflow-hidden`}
    >
      <FooterMenu menu={menu} />
      <CountrySelector />
      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
        Licensed Open Source project.
      </div>
    </Section>
  );
}

function FooterLink({item}) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}

function FooterMenu({menu}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${
                      open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items.map((subItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}

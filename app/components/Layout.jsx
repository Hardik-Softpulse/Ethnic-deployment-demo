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
              <a href="#" className="st-nav-ic st-nav-trigger">
                <span></span>
                <span></span>
                <span></span>
              </a>
              <a href="#" className="st-nav-ic st-nav-search visible-x">
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
              <a href="#" className="st-nav-ic st-nav-search hidden-x">
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
      role="contentinfo"
      className={`footer-section`}
    >
      <FooterMenu menu={menu} />
      {/* <CountrySelector /> */}
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
    <div>
      <div className="newsletter-section text-center">
        <div className="container">
          <h3 className="text-white text-up">sign up our newsletter</h3>
          <p className="text-white">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. it has been the industry's standard dummy text ever since
            the 1500s
          </p>
          <div className="newsletter-box">
            <form>
              <input
                type="email"
                name=""
                placeholder="Enter your email address"
                className="input-ele iwhite"
              />
              <input
                type="submit"
                name=""
                value="Submit"
                className="btn submit-btn"
              />
            </form>
          </div>
        </div>
      </div>
      <footer className="site-footer">
        <div className="container">
          <div className="row m-15">
            {(menu?.items || []).map((item) => (
              <div className="stft-col col site-footer-nav lp-05">
                <h6 className="stft-cl-title text-up">
                  {item.title}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 284.929 284.929"
                  >
                    <path d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441   L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082   c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647   c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"></path>
                  </svg>
                </h6>
                <ul className="stft-cl-content">
                  {item.items.map((subItem) => (
                    <li key={subItem.id}>
                      <a href={subItem.to}>{subItem.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="stft-col col site-ext-info text-right">
              <h6 className="text-up">Follow us</h6>
              <div className="social-icons dfx flxwrp flxend">
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                  </svg>
                </a>

                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                  </svg>
                </a>
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.829 6.302c-.738-.034-.96-.04-2.829-.04s-2.09.007-2.828.04c-1.899.087-2.783.986-2.87 2.87-.033.738-.041.959-.041 2.828s.008 2.09.041 2.829c.087 1.879.967 2.783 2.87 2.87.737.033.959.041 2.828.041 1.87 0 2.091-.007 2.829-.041 1.899-.086 2.782-.988 2.87-2.87.033-.738.04-.96.04-2.829s-.007-2.09-.04-2.828c-.088-1.883-.973-2.783-2.87-2.87zm-2.829 9.293c-1.985 0-3.595-1.609-3.595-3.595 0-1.985 1.61-3.594 3.595-3.594s3.595 1.609 3.595 3.594c0 1.985-1.61 3.595-3.595 3.595zm3.737-6.491c-.464 0-.84-.376-.84-.84 0-.464.376-.84.84-.84.464 0 .84.376.84.84 0 .463-.376.84-.84.84zm-1.404 2.896c0 1.289-1.045 2.333-2.333 2.333s-2.333-1.044-2.333-2.333c0-1.289 1.045-2.333 2.333-2.333s2.333 1.044 2.333 2.333zm-2.333-12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.958 14.886c-.115 2.545-1.532 3.955-4.071 4.072-.747.034-.986.042-2.887.042s-2.139-.008-2.886-.042c-2.544-.117-3.955-1.529-4.072-4.072-.034-.746-.042-.985-.042-2.886 0-1.901.008-2.139.042-2.886.117-2.544 1.529-3.955 4.072-4.071.747-.035.985-.043 2.886-.043s2.14.008 2.887.043c2.545.117 3.957 1.532 4.071 4.071.034.747.042.985.042 2.886 0 1.901-.008 2.14-.042 2.886z" />
                  </svg>
                </a>
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z" />
                  </svg>
                </a>
              </div>
              <h6 className="text-up">We Accept</h6>
              <div className="payment-icon dfx flxwrp flxend">
                <img src={visa} alt="" />
                <img src={paypal} alt="" />
                <img src={mastercard} alt="" />
                <img src={americanExpress} alt="" />
                <img src={masestro} alt="" />
                <img src={dinersClub} alt="" />
              </div>
              <p className="copyright-text">
                &copy; {new Date().getFullYear()} SHOES. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

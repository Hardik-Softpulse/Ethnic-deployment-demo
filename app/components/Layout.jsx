import logoImg from '../img/logo2.jpg';
import footerLogo from '../img/footer-logo.jpg';
import {Suspense, useEffect, useState} from 'react';
import {useIsHomePath} from '~/lib/utils';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {CartForm} from '@shopify/hydrogen';
import {Await, Form, Link, useMatches, useParams} from '@remix-run/react';
import {CartLoading} from './CartLoading';
import {CartDrawer} from './CartDrawer';
import SimpleForm from '../components/Newslatter/SimpleForm';

export function Layout({
  children,
  layout,
  toggle,
  setToggle,
  isCartOpen,
  setCartOpen,
  seo,
}) {
  const {headerMenu, footerMenu} = layout;

  return (
    <div>
      {headerMenu && (
        <Header
          title={layout.shop.name}
          menu={headerMenu}
          toggle={toggle}
          setToggle={setToggle}
          isCartOpen={isCartOpen}
          setCartOpen={setCartOpen}
        />
      )}
      <main role="main" id="mainContent" className="flex-grow">
        {children}
      </main>

      {footerMenu && <Footer menu={footerMenu} seo={seo.sameAs} />}
    </div>
  );
}

function Header({title, menu, toggle, setToggle, isCartOpen, setCartOpen}) {
  const isHome = useIsHomePath();

  return (
    <>
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        toggle={toggle}
        setToggle={setToggle}
        isCartOpen={isCartOpen}
        setCartOpen={setCartOpen}
      />
    </>
  );
}

function DesktopHeader({
  isHome,
  menu,
  toggle,
  setToggle,
  isCartOpen,
  setCartOpen,
}) {
  const params = useParams();
  const [isSticky, setIsSticky] = useState(false);
  const [subMenu, setSubMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Home');
  const [searchBar, setSearchBar] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setToggle(true);
  };

  const handleMenu = (title) => {
    setActiveMenu(title);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeMenu]);

  return (
    <>
      <div className="promotion-bar text-center ">
        <div className="container">Free shipping on order above $20.</div>
      </div>
      <header className="site-header">
        {/* className={`site-header ${isSticky ? 'sticky' : ''}`} */}
        <div className="site-logo-nav">
          <div className="container">
            <div className="row flxnwrp">
              <div className="st-col st-nav-icon icx dfx visible-x">
                <a
                  href="/"
                  className="st-nav-ic st-nav-trigger"
                  onClick={(e) => handleClick(e)}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </a>
                <Form
                  method="get"
                  action={
                    params.locale ? `/${params.locale}/search` : '/search'
                  }
                  className="st-nav-ic st-nav-search visible-x searchForm"
                >
                  <a href="#" onClick={() => setSearchBar(!searchBar)}>
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
                  <input
                    className="search"
                    type="search"
                    variant="minisearch"
                    placeholder="Search"
                    name="q"
                    style={{display: searchBar ? 'block' : 'none'}}
                  />
                </Form>
              </div>
              <div className="st-col st-nav-logo flx-auto">
                <a href="/">
                  <img src={logoImg} />
                </a>
              </div>
              <div className={`st-col st-nav-menu ${toggle ? 'open' : ''}`}>
                <span className="close_icon">
                  <svg
                    onClick={() => setToggle(!toggle)}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M2.28167 0.391468C1.7597 -0.130489 0.913438 -0.130489 0.391468 0.391468C-0.130489 0.913438 -0.130489 1.7597 0.391468 2.28167L8.10978 9.99996L0.391548 17.7182C-0.130409 18.2402 -0.130409 19.0865 0.391548 19.6084C0.913518 20.1303 1.75978 20.1303 2.28174 19.6084L9.99996 11.8901L17.7182 19.6084C18.2402 20.1303 19.0865 20.1303 19.6084 19.6084C20.1303 19.0865 20.1303 18.2402 19.6084 17.7182L11.8901 9.99996L19.6086 2.28167C20.1305 1.7597 20.1305 0.913438 19.6086 0.391468C19.0866 -0.130489 18.2403 -0.130489 17.7184 0.391468L9.99996 8.10978L2.28167 0.391468Z"
                      fill="black"
                    ></path>
                  </svg>
                </span>
                <ul className="site-nav">
                  {(menu?.items || []).map((item) => {
                    return (
                      <li
                        key={item.id}
                        prefetch="intent"
                        className="st-nav-li drop_down"
                      >
                        <Link
                          to={item.to}
                          target={item.target}
                          onClick={() => {
                            handleMenu(item.title);
                          }}
                          className={`${
                            activeMenu === item.title
                              ? 'st-nav-link active'
                              : 'st-nav-link'
                          }`}
                        >
                          {item.title}
                        </Link>
                        {item.items != 0 && (
                          <span
                            className="down_arw"
                            onClick={() => setSubMenu(!subMenu)}
                          >
                            <svg
                              aria-hidden="true"
                              focusable="false"
                              viewBox="0 0 10 6"
                              width="11px"
                              height="11px"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                        )}

                        {subMenu &&
                          item.items?.map((menuItem) => (
                            <div className="hdr_sub_menu" key={menuItem.id}>
                              <a href={menuItem.to}>{menuItem.title}</a>
                            </div>
                          ))}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div
                className={`drawer-overlay ${toggle ? 'active' : ''}`}
                onClick={() => setToggle(!toggle)}
              ></div>
              <div className="st-col st-nav-icon dfx flxwrp flxend ">
                <Form
                  method="get"
                  action={
                    params.locale ? `/${params.locale}/search` : '/search'
                  }
                  className="st-nav-ic st-nav-search hidden-x searchForm "
                >
                  <input
                    id="searchInput"
                    className="search"
                    type="search"
                    variant="minisearch"
                    placeholder="Search"
                    name="q"
                    style={{display: 'none'}}
                  />
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      const searchInput =
                        document.getElementById('searchInput');
                      searchInput.style.display =
                        searchInput.style.display === 'none' ? 'block' : 'none';
                    }}
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
                </Form>

                <AccountLink className="st-nav-ic st-nav-user " />
                <CartCount
                  isHome={isHome}
                  isCartOpen={isCartOpen}
                  setCartOpen={setCartOpen}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

function AccountLink({className}) {
  const [root] = useMatches();
  const isLoggedIn = root.data?.isLoggedIn;

  return isLoggedIn ? (
    <Link to="/account" className={className}>
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
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
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
    </Link>
  );
}

function CartCount({isHome, isCartOpen, setCartOpen}) {
  const [root] = useMatches();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
  }, [addToCartFetchers, isCartOpen]);

  return (
    <Suspense
      fallback={<Badge count={0} dark={isHome} isCartOpen={isCartOpen} />}
    >
      <Await resolve={root.data?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            isCartOpen={isCartOpen}
            count={cart?.totalQuantity || 0}
            setCartOpen={setCartOpen}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({isCartOpen, count, setCartOpen}) {
  return (
    <>
      <div
        className="st-nav-ic st-nav-cart"
        onClick={() => setCartOpen(!isCartOpen)}
      >
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
        <span>{count || 0}</span>
      </div>
      {isCartOpen && (
        <MiniCart isCartOpen={isCartOpen} setCartOpen={setCartOpen} />
      )}
    </>
  );
}

function MiniCart({isCartOpen, onClose, setCartOpen}) {
  const [root] = useMatches();

  return (
    <Suspense fallback={<CartLoading />}>
      <Await resolve={root.data?.cart}>
        {(cart) => (
          <>
            <CartDrawer
              onClose={onClose}
              cart={cart}
              isCartOpen={isCartOpen}
              setCartOpen={setCartOpen}
            />
          </>
        )}
      </Await>
    </Suspense>
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

function Footer({menu, seo}) {
  return (
    <footer className="site-footer">
      <div className="container">
        <FooterMenu menu={menu} seo={seo} />
      </div>
    </footer>
  );
}

function FooterMenu({menu, seo}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  console.log('seo', seo);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleDropdown = (menuId) => {
    if (isMobile) {
      setOpenMenuId((prevOpenMenuId) =>
        prevOpenMenuId === menuId ? null : menuId,
      );
    }
  };

  return (
    <div className="site-footer-container">
      <div className="footer-items">
        <div className="stft-col col site-footer-details ">
          <div className="footer-logo">
            <img src={footerLogo} />
            <p className="footer-item-des">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa. Cum sociis Theme natoque
              penatibus et magnis mauris nulla ut sapien dictum
            </p>
          </div>
        </div>
        {(menu?.items || []).map((item) => (
          <div
            className="stft-col col site-footer-nav lp-05"
            key={item.id}
            onClick={() => toggleDropdown(item.id)}
          >
            <h6
              className={`stft-cl-title text-up ${
                openMenuId === item.id ? 'active' : ''
              }`}
            >
              {item.title}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 284.929 284.929"
                style={{display: openMenuId == item.id ? 'block' : ''}}
              >
                <path d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441   L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082   c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647   c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"></path>
              </svg>
            </h6>

            <ul
              className="stft-cl-content"
              style={{display: openMenuId == item.id ? 'block' : ''}}
            >
              {item.items.map((subItem) => (
                <li key={subItem.id}>
                  <FooterLink key={subItem.id} item={subItem} />
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="stft-col col site-ext-info ">
          <div className="newslatter-form">
            <SimpleForm />
          </div>
          <div className="social-icons dfx flxwrp ">
            <a href={seo[1]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
              </svg>
            </a>
            <a href={seo[0]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
              </svg>
            </a>
            <a href={seo[3]}>
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
            <a href={seo[4]}>
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
        </div>
      </div>

      <div>
        <p className="copyright-text">© 2020 SHOES. ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  );
}

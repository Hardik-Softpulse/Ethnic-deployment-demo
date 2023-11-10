import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useMatches,
  useOutlet,
} from '@remix-run/react';
import {json, defer, redirect} from '@shopify/remix-oxygen';
import {usePrefixPathWithLocale} from '~/lib/utils';
import {CACHE_NONE, routeHeaders} from '~/data/cache';
import {doLogout} from './($locale).account.logout';
import {useState} from 'react';
import {flattenConnection} from '@shopify/hydrogen';
import {
  AccountAddressBook,
  Modal,
  OrderCard,
  AccountDetails,
} from '~/components';

import ChangePassword from './($locale).account.changePassword';

export const headers = routeHeaders;

const badRequest = (data) => json(data, {status: 400});

export const action = async ({request, context}) => {
  const formData = await request.formData();
  const email = formData.get('email');

  if (!email || typeof email !== 'string') {
    return badRequest({
      formError: 'Please provide an email.',
    });
  }

  try {
    await context.storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
      variables: {email},
    });

    return json({resetRequested: true});
  } catch (error) {
    return badRequest({
      formError: 'Something went wrong. Please try again later.',
    });
  }
};

export async function loader({request, context, params}) {
  const {pathname} = new URL(request.url);
  const locale = params.locale;
  const customerAccessToken = await context.session.get('customerAccessToken');
  const isAuthenticated = Boolean(customerAccessToken);
  const loginPath = locale ? `/${locale}/account/login` : '/account/login';
  const isAccountPage = /^\/account\/?$/.test(pathname);

  if (!isAuthenticated) {
    if (isAccountPage) {
      return redirect(loginPath);
    }
    // pass through to public routes
    return json({isAuthenticated: false});
  }

  const customer = await getCustomer(context, customerAccessToken);

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}.`
      : `Welcome to your account.`
    : 'Account Details';

  return defer(
    {
      isAuthenticated,
      customer,
      heading,
    },
    {
      headers: {
        'Cache-Control': CACHE_NONE,
      },
    },
  );
}

export default function Authenticated() {
  const data = useLoaderData();
  const outlet = useOutlet();
  const matches = useMatches();
  const [isAddressFormPopupVisible, setAddressFormPopupVisible] =
    useState(true);

  const toggleFormVisibility = () => {
    setAddressFormPopupVisible((prevFlag) => {
      return !prevFlag;
    });
  };

  // routes that export handle { renderInModal: true }
  const renderOutletInModal = matches.some((match) => {
    return match?.handle?.renderInModal;
  });

  // Public routes
  if (!data.isAuthenticated) {
    return <Outlet />;
  }

  // Authenticated routes
  if (outlet) {
    if (renderOutletInModal) {
      return (
        <>
          <Modal
            cancelLink="/account"
            isAddressFormPopupVisible={isAddressFormPopupVisible}
          >
            <Outlet context={{customer: data.customer}} />
          </Modal>
          <Account {...data} toggleFormVisibility={toggleFormVisibility} />
        </>
      );
    } else {
      return <Outlet context={{customer: data.customer}} />;
    }
  }

  return <Account {...data} />;
}

function Account({customer, toggleFormVisibility}) {
  const [activeTab, setActiveTab] = useState('cst-dashboard');
  const orders = flattenConnection(customer.orders);
  const addresses = flattenConnection(customer.addresses);

  const [isChangePasswordPopupOpen, setChangePasswordPopupOpen] =
    useState(false);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'cst-dashboard') {
      setChangePasswordPopupOpen(!isChangePasswordPopupOpen);
    }
  };

  return (
    <div className="cust-account-page clearfix">
      <div className="breadcrumb">
        <div className="container">
          <span>
            <a href="/">Home</a>
          </span>
          <span>My Account</span>
        </div>
      </div>
      <div className="container">
        <h2 className="page-title">My Account</h2>
        <div className="row flxnwrp flxanst">
          <div className="cust-side-links">
            <Link
              to="/account"
              className={`cst-ac-link ${
                activeTab === 'cst-dashboard' ? 'active' : ''
              }`}
              onClick={() => handleTabClick('cst-dashboard')}
            >
              Account Dashboard
            </Link>
            <Link
              to=""
              className={`cst-ac-link ${
                activeTab === 'cst-information' ? 'active' : ''
              }`}
              onClick={() => handleTabClick('cst-information')}
            >
              Account Information
            </Link>
            <Link
              to="#"
              className={`cst-ac-link ${
                activeTab === 'cst-address' ? 'active' : ''
              }`}
              onClick={() => handleTabClick('cst-address')}
            >
              Address Book
            </Link>
            <Link
              to="#"
              className={`cst-ac-link ${
                activeTab === 'cst-order' ? 'active' : ''
              }`}
              onClick={() => handleTabClick('cst-order')}
            >
              My Orders
            </Link>

            <Form
              method="post"
              action={usePrefixPathWithLocale('/account/logout')}
            >
              <button type="submit" className="signout">
                Sign out
              </button>
            </Form>
          </div>
          <div
            className="cust-side-content show"
            id="cst-dashboard"
            style={{display: activeTab === 'cst-dashboard' ? 'block' : 'none'}}
          >
            <h2>Contact Information</h2>
            <p>
              {customer.firstName + ' ' + customer.lastName}
              <br />
              {customer.email}
            </p>
            <button
              className="btn change-psw-link lp-05"
              onClick={() =>
                setChangePasswordPopupOpen(!isChangePasswordPopupOpen)
              }
              style={{display: isChangePasswordPopupOpen ? 'none' : 'block'}}
            >
              Change Password
            </button>
            {activeTab === 'cst-dashboard' && isChangePasswordPopupOpen && (
              <ChangePassword
                isChangePasswordPopupOpen={isChangePasswordPopupOpen}
                setChangePasswordPopupOpen={setChangePasswordPopupOpen}
              />
            )}
          </div>
          <AccountDetails activeTab={activeTab} customer={customer} />
          <AccountAddressBook
            activeTab={activeTab}
            addresses={addresses}
            customer={customer}
            toggleFormVisibility={toggleFormVisibility}
          />
          <AccountOrderHistory orders={orders} activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}

function AccountOrderHistory({orders, activeTab}) {
  return (
    <div
      className="cust-side-content"
      id="cst-order"
      style={{display: activeTab === 'cst-order' ? 'block' : 'none'}}
    >
      <h2>Order History</h2>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Order id</th>
              <th>Order Number</th>
              <th>Date</th>
              <th>Payment Status</th>
              <th>Fulfillment Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                {orders?.length ? <OrderCard order={order} /> : <EmptyOrders />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div>
      <h3 className="mb-1" size="fine" width="narrow" as="p">
        You haven&apos;t placed any orders yet.
      </h3>
      <div className="w-48">
        <button
          className="w-full mt-2 text-sm"
          variant="secondary"
          to={usePrefixPathWithLocale('/')}
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
}

const ORDER_CARD_FRAGMENT = `#graphql
  fragment OrderCard on Order {
    id
    orderNumber
    processedAt
    financialStatus
    fulfillmentStatus
    currentTotalPrice {
      amount
      currencyCode
    }
    lineItems(first: 2) {
      edges {
        node {
          variant {
            image {
              url
              altText
              height
              width
            }
          }
          title
        }
      }
    }
  }
`;

const CUSTOMER_QUERY = `#graphql
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerDetails
    }
  }

  fragment AddressPartial on MailingAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    country
    province
    city
    zip
    phone
  }

  fragment CustomerDetails on Customer {
    firstName
    lastName
    phone
    email
    defaultAddress {
      ...AddressPartial
    }
    addresses(first: 6) {
      edges {
        node {
          ...AddressPartial
        }
      }
    }
    orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        node {
          ...OrderCard
        }
      }
    }
  }

  ${ORDER_CARD_FRAGMENT}
`;

export async function getCustomer(context, customerAccessToken) {
  const {storefront} = context;

  const data = await storefront.query(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  /**
   * If the customer failed to load, we assume their access token is invalid.
   */
  if (!data || !data.customer) {
    throw await doLogout(context);
  }

  return data.customer;
}


const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
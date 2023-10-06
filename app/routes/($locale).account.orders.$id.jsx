import invariant from 'tiny-invariant';
import clsx from 'clsx';
import {json, redirect} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Money, Image, flattenConnection} from '@shopify/hydrogen';

import {statusMessage} from '~/lib/utils';
import {Link} from '~/components';

export const meta = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({request, context, params}) {
  if (!params.id) {
    return redirect(params?.locale ? `${params.locale}/account` : '/account');
  }

  const queryParams = new URL(request.url).searchParams;
  const orderToken = queryParams.get('key');

  invariant(orderToken, 'Order token is required');

  const customerAccessToken = await context.session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect(
      params.locale ? `${params.locale}/account/login` : '/account/login',
    );
  }

  const orderId = `gid://shopify/Order/${params.id}?key=${orderToken}`;
  console.log('orderId', orderId);

  const {node: order} = await context.storefront.query(CUSTOMER_ORDER_QUERY, {
    variables: {orderId},
  });

  if (!order || !('lineItems' in order)) {
    throw new Response('Order not found', {status: 404});
  }

  const lineItems = flattenConnection(order.lineItems);

  const discountApplications = flattenConnection(order.discountApplications);

  const firstDiscount = discountApplications[0]?.value;

  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' && firstDiscount;

  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue' &&
    firstDiscount?.percentage;

  return json({
    order,
    lineItems,
    discountValue,
    discountPercentage,
  });
}

export default function OrderRoute() {
  const {order, lineItems, discountValue, discountPercentage} = useLoaderData();
  console.log('order', order);
  return (
    <div className="cust-account-page clearfix">
      <div className="breadcrumb">
        <div className="container">
          <span>
            <a href="/">Home</a>
          </span>
          <span>
            <a href="/account">My Account</a>
          </span>
        </div>
      </div>
      <div className="container">
        <h2 className="page-title text-up text-center">Order Details</h2>
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Order No</th>
                <th>Placed on</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Discounts</th>
                <th>Subtotal</th>
                <th>Tax</th>
                <th>Total</th>
                <th>status</th>
                <th>Shipping Address</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((lineItem) => {
                lineItem.variant === null && <span>not available</span>;
                return (
                  <tr key={lineItem.variant?.id}>
                    <td>{order.name}</td>
                    <td>{new Date(order.processedAt).toDateString()}</td>
                    <td>
                      <div>
                        <Link
                          to={`/products/${lineItem.variant?.product?.handle}`}
                        >
                          {lineItem?.variant?.image && (
                            <div>
                              <Image
                                data={lineItem.variant.image}
                                width={96}
                                height={96}
                              />
                            </div>
                          )}
                        </Link>
                        <span>{lineItem.title}</span>
                        <span>{lineItem.variant?.title}</span>
                      </div>
                    </td>
                    <td>{/* <Money data={lineItem.variant?.price} /> */}</td>
                    <td>{lineItem.quantity}</td>
                    <td>
                      <span>
                        <Money data={lineItem.discountedTotalPrice} />
                      </span>
                    </td>
                    <td>
                      <Money data={order.subtotalPriceV2} />
                    </td>
                    <td>
                      <Money data={order.totalTaxV2} />
                    </td>
                    <td>
                      <Money data={order.totalPriceV2} />
                    </td>
                    <td>{statusMessage(order.fulfillmentStatus)}</td>
                    <td>
                      {order?.shippingAddress ? (
                        <ul className="mt-6">
                          <li>
                            <span>
                              {order.shippingAddress.firstName &&
                                order.shippingAddress.firstName + ' '}
                              {order.shippingAddress.lastName}
                            </span>
                          </li>
                          {order?.shippingAddress?.formatted ? (
                            order.shippingAddress.formatted.map((line) => (
                              <li key={line}>
                                <span>{line}</span>
                              </li>
                            ))
                          ) : (
                            <></>
                          )}
                        </ul>
                      ) : (
                        <p className="mt-3">No shipping address defined</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const CUSTOMER_ORDER_QUERY = `#graphql
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
  fragment AddressFull on MailingAddress {
    address1
    address2
    city
    company
    country
    countryCodeV2
    firstName
    formatted
    id
    lastName
    name
    phone
    province
    provinceCode
    zip
  }
  fragment DiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        amount
        currencyCode
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment Image on Image {
    altText
    height
    src: url(transform: {crop: CENTER, maxHeight: 96, maxWidth: 96, scale: 2})
    id
    width
  }
  fragment ProductVariant on ProductVariant {
    id
    image {
      ...Image
    }
    price {
      ...Money
    }
    product {
      handle
    }
    sku
    title
  }
  fragment LineItemFull on OrderLineItem {
    title
    quantity
    discountAllocations {
      allocatedAmount {
        ...Money
      }
      discountApplication {
        ...DiscountApplication
      }
    }
    originalTotalPrice {
      ...Money
    }
    discountedTotalPrice {
      ...Money
    }
    variant {
      ...ProductVariant
    }
  }

  query CustomerOrder(
    $country: CountryCode
    $language: LanguageCode
    $orderId: ID!
  ) @inContext(country: $country, language: $language) {
    node(id: $orderId) {
      ... on Order {
        id
        name
        orderNumber
        processedAt
        fulfillmentStatus
        totalTaxV2 {
          ...Money
        }
        totalPriceV2 {
          ...Money
        }
        subtotalPriceV2 {
          ...Money
        }
        shippingAddress {
          ...AddressFull
        }
        discountApplications(first: 100) {
          nodes {
            ...DiscountApplication
          }
        }
        lineItems(first: 100) {
          nodes {
            ...LineItemFull
          }
        }
      }
    }
  }
`;

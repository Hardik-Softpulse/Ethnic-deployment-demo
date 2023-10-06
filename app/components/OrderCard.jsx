import {flattenConnection} from '@shopify/hydrogen';
import {Link} from './Link';

export function OrderCard({order}) {
  if (!order?.id) return null;
  const [legacyOrderId, key] = order.id.split('/').pop().split('?');
  const lineItems = flattenConnection(order?.lineItems);

  return (
    <tr>
      <td>
        <Link
          to={`/account/orders/${legacyOrderId}?${key}`}
          title="OrderDatail"
        >
          {order.id}
        </Link>
      </td>
      <td>{order.orderNumber}</td>
      <td>{order.processedAt}</td>
      <td>{order.financialStatus}</td>
      <td>{order.fulfillmentStatus}</td>
      <td>{order.currentTotalPrice.amount}</td>
    </tr>
  );
}

export const ORDER_CARD_FRAGMENT = `#graphql
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

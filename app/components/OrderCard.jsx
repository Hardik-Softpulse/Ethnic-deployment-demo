import {Link} from './Link';
import moment from 'moment';

export function OrderCard({order}) {
  if (!order?.id) return null;
  const [legacyOrderId, key] = order.id.split('/').pop().split('?');

  const date = moment(order.processedAt).format('DD/MM/YYYY');
  return (
    <>
      <td>
        <Link
          to={`/account/orders/${legacyOrderId}?${key}`}
          title="OrderDatail"
        >
          {order.orderNumber}
        </Link>
      </td>
      <td>{date}</td>
      <td>{order.financialStatus}</td>
      <td>{order.fulfillmentStatus}</td>
      <td>{order.currentTotalPrice.amount}</td>
    </>
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

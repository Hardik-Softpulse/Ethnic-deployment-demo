import visa from '../img/visa.png';
import paypal from '../img/paypal.png';
import mastercard from '../img/mastercard.png';
import americanExpress from '../img/american-express.png';
import masestro from '../img/masestro.png';
import dinersClub from '../img/diners-club.png';
import {CartForm, Image, Money, flattenConnection} from '@shopify/hydrogen';
import {Link} from './Link';
import {useEffect , useState} from 'react';

export function Cart({cart}) {
 
  const linesCount = Boolean(cart?.lines?.edges?.length || 0);

  return (
    <div className="cart-page bg-grey ">
      <div className="breadcrumb">
        <div className="container">
          <span>
            <a href="/">Home</a>
          </span>
          <span>cart</span>
        </div>
      </div>
      <div className="container cart-container">
        <h2 className="page-title text-up text-center">Your Bag</h2>
        <CartEmpty hidden={linesCount} />
        <CartDetails cart={cart} />
      </div>
    </div>
  );
}

export function CartDetails({cart}) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="row flxspc flxanst">
      <CartLines lines={cart?.lines} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} checkoutUrl={cart.checkoutUrl} />
      )}
    </div>
  );
}

export function CartEmpty({hidden = false}) {
  if (hidden) {
    return null;
  }
  return (
    <div className="empty-cart">
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <Link className="btn" to={'/collections'}>
        Continue shopping
      </Link>
    </div>
  );
}

function CartLines({lines: cartLines}) {
  const currentLines = cartLines ? flattenConnection(cartLines) : [];

  return (
    <div className="cart-item-list">
      {currentLines.map((line) => (
        <CartLineItem key={line.id} line={line} />
      ))}
    </div>
  );
}

function CartLineItem({line}) {
  if (!line?.id) return null;
  const {id, quantity, merchandise} = line;
  if (typeof quantity === 'undefined' || !merchandise?.product) return null;



  return (
    <div className="cart-item dfx">
      <Link
        to={`/products/${merchandise.product.handle}`}
        className="cart-image"
      >
        {merchandise.image && (
          <Image
            width={110}
            height={110}
            data={merchandise.image}
            alt={merchandise.title}
          />
        )}
      </Link>
      <div className="cart-info dfxcl">
        {merchandise?.product?.handle ? (
          <div className="cart-dtl">
            <h6>
              <Link to={`/products/${merchandise.product.handle}`}>
                {merchandise?.product?.title || ''}
              </Link>
            </h6>

            <div className="cart-edits dfx">
              <div className="cart-elinks">
                <ItemRemoveButton lineIds={[id]} />
              </div>
            </div>
          </div>
        ) : (
          <h6>{merchandise?.product?.title || ''}</h6>
        )}
        <div className="cart-price">
          <span className="s-price">
            <strong>
              <CartLinePrice line={line} />
            </strong>
          </span>
        </div>
        <div className="cart-variant">
          {(merchandise?.selectedOptions || []).map((option) => (
            <span key={option.name}>
              {option.name} : {option.value}
            </span>
          ))}
        </div>
        <CartLineQuantityAdjust line={line} />
      </div>
    </div>
  );
}

function CartLinePrice({line, priceType = 'regular', ...passthroughProps}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />;
}

function CartLineQuantityAdjust({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="qty-box">
      <UpdateCartButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          className="qty-minus qty-btn"
          name="decrease-quantity"
          value={prevQuantity}
          disabled={quantity <= 1}
        >
          -
        </button>
      </UpdateCartButton>
      <input
        type="text"
        name="value"
        className="qty-input"
        value={quantity}
        readOnly
      />
      <UpdateCartButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          className="qty-plus qty-btn"
          name="increase-quantity"
          value={nextQuantity}
          aria-label="Increase quantity"
        >
          +
        </button>
      </UpdateCartButton>
    </div>
  );
}

function CartSummary({
  cost,
  discountCodes,
  children = null,
  cartHasItems,
  checkoutUrl,
}) {
  console.log('discountCodes', discountCodes);
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  const originalSubtotal = cost?.subtotalAmount?.amount || 0;
  const originalTotal = cost?.totalAmount?.amount || 0;

  const discountAmount = originalSubtotal - originalTotal;
  const discountAmountNumber = parseFloat(discountAmount);
  const discountPrice = {
    amount: discountAmountNumber.toString(),
    currencyCode: 'INR',
  };

  let discountPercentage = 0;

  if (cost?.totalAmount?.amount >= 4.21 && cost?.totalAmount?.amount <= 6.21) {
    discountPercentage = 10;
  } else if (cost?.totalAmount?.amount >= 6.21) {
    discountPercentage = 20;
  }

  return (
    <div className="cart-subtotal">
      <h5 className="text-up">Order Summary</h5>
      <ul>
        <li>
          <span>SUBTOTAL</span>{' '}
          <span>
            {cost?.subtotalAmount?.amount ? (
              <Money withoutTrailingZeros data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </li>
        <li>
          <span>DISCOUNTS {`GET ${discountPercentage}`}</span>
          <span>
            {discountAmount > 0 ? (
              <Money withoutTrailingZeros data={discountPrice} />
            ) : (
              '-'
            )}
          </span>
        </li>
        <div className=" cart-divider"></div>
        <li className="cart-total">
          <span>
            <strong>TOTAL</strong>
            <br /> <small>(Inclusive of all taxes)</small>
          </span>
          <span>
            <strong>
              {cost?.totalAmount?.amount ? (
                <Money withoutTrailingZeros data={cost?.totalAmount} />
              ) : (
                '-'
              )}
            </strong>
          </span>
        </li>
      </ul>
      <CartCheckoutActions checkoutUrl={checkoutUrl} />
      <div className="shipping-text lp-05 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 18"
          width="24"
          height="18"
        >
          <path
            fillRule="evenodd"
            d="M5 8L5 9L13 9L13 2L3 2L3 1C3 0.45 3.45 0 4 0C6.58 0 11.42 0 14 0C14.55 0 15 0.45 15 1L15 3L19.67 3C20.78 3 21.27 3.58 21.6 4.11C22.2 5.05 23.14 6.54 23.71 7.48C23.9 7.8 24 8.15 24 8.52C24 9.71 24 11.5 24 13C24 14.09 23.26 15 22 15L21 15C21 16.66 19.66 18 18 18C16.34 18 15 16.66 15 15L11 15C11 16.66 9.66 18 8 18C6.34 18 5 16.66 5 15L4 15C3.45 15 3 14.55 3 14L3 8L1 8L1 6L8 6L8 8L5 8ZM6.8 15C6.8 15.66 7.34 16.2 8 16.2C8.66 16.2 9.2 15.66 9.2 15C9.2 14.34 8.66 13.8 8 13.8C7.34 13.8 6.8 14.34 6.8 15ZM16.8 15C16.8 15.66 17.34 16.2 18 16.2C18.66 16.2 19.2 15.66 19.2 15C19.2 14.34 18.66 13.8 18 13.8C17.34 13.8 16.8 14.34 16.8 15ZM15 11L5 11L5 13L5.76 13C6.31 12.39 7.11 12 8 12C8.89 12 9.69 12.39 10.24 13L15.76 13C16.31 12.39 17.11 12 18 12C18.89 12 19.69 12.39 20.24 13L22 13L22 8.43C22 8.43 20.84 6.44 20.29 5.5C20.11 5.19 19.78 5 19.43 5L15 5L15 11ZM18.7 6C19.06 6 19.4 6.19 19.57 6.5C20.06 7.36 21 9 21 9L16 9L16 6C16 6 17.83 6 18.7 6ZM0 3L8 3L8 5L0 5L0 3Z"
          />
        </svg>
        Free shipping on order above $20
      </div>
      <h6 className="text-up">Need help ?</h6>
      <div className="help-links dfx flxspc text-up">
        <Link to="/policies">Shipping</Link>
        <Link to="/policies/refund-policy">Returns & Exchanges</Link>
      </div>
      <h6 className="text-up">Accepted payment methods</h6>
      <div className="payment-icon dfx flxwrp">
        <img src={visa} />
        <img src={paypal} />
        <img src={mastercard} />
        <img src={americanExpress} />
        <img src={masestro} />
        <img src={dinersClub} />
      </div>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div className="flex flex-col mt-2">
      <Link to={checkoutUrl} target="_self">
        <button
          type="button"
          name=""
          className="btn chckc-btn"
          value="Checkout"
        >
          Checkout
        </button>
      </Link>
    </div>
  );
}

function UpdateCartButton({children, lines}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{
        lines,
      }}
    >
      {children}
    </CartForm>
  );
}

function ItemRemoveButton({lineIds}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{
        lineIds,
      }}
    >
      <button className="cart-remove">Remove</button>
    </CartForm>
  );
}

function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

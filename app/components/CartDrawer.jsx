import {CartForm, Image, Money, flattenConnection} from '@shopify/hydrogen';
import {Link} from './Link';

export function CartDrawer({isCartOpen, cart, setCartOpen}) {
  const linesCount = Boolean(cart?.lines?.edges?.length || 0);
 
  return (
    <>
      <div
        id="cart-drawer"
        className={`cart-drawer cartdrawer-block ${isCartOpen ? 'open' : ''}`}
      >
        <div className="cart-container">
          <div className="cart-header">
            <h2 className="page-title text-up">Your Bag</h2>
            <span className="close_icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                onClick={() => setCartOpen(!isCartOpen)}
              >
                <path
                  d="M2.28167 0.391468C1.7597 -0.130489 0.913438 -0.130489 0.391468 0.391468C-0.130489 0.913438 -0.130489 1.7597 0.391468 2.28167L8.10978 9.99996L0.391548 17.7182C-0.130409 18.2402 -0.130409 19.0865 0.391548 19.6084C0.913518 20.1303 1.75978 20.1303 2.28174 19.6084L9.99996 11.8901L17.7182 19.6084C18.2402 20.1303 19.0865 20.1303 19.6084 19.6084C20.1303 19.0865 20.1303 18.2402 19.6084 17.7182L11.8901 9.99996L19.6086 2.28167C20.1305 1.7597 20.1305 0.913438 19.6086 0.391468C19.0866 -0.130489 18.2403 -0.130489 17.7184 0.391468L9.99996 8.10978L2.28167 0.391468Z"
                  fill="black"
                />
              </svg>
            </span>
          </div>
          <CartEmpty hidden={linesCount}    setCartOpen={setCartOpen}
            isCartOpen={isCartOpen}/>
          <CartDetails
            cart={cart}
            setCartOpen={setCartOpen}
            isCartOpen={isCartOpen}
          />
        </div>
      </div>
      <div
        className={`drawer-overlay  ${isCartOpen ? 'active' : ''}`}
        onClick={() => setCartOpen(!isCartOpen)}
      ></div>
    </>
  );
}

export function CartDetails({cart, setCartOpen, isCartOpen}) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="cartDrawer-productdetails">
      <CartLines lines={cart?.lines} />
      {cartHasItems && (
        <CartSummary
          cost={cart.cost}
          checkoutUrl={cart.checkoutUrl}
          
        />
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
      <Link className="btn" to={'/collections'} onClick={() => setCartOpen(!isCartOpen)}>
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
      <div className="cart-drawer-cartinfo">
        {merchandise?.product?.handle ? (
          <div className="cart-drawer-cartdtl">
            <h6>
              <Link to={`/products/${merchandise.product.handle}`}>
                {merchandise?.product?.title || ''}
              </Link>
            </h6>
            <div className="cart-price">
              <span className="s-price">
                <strong>
                  <CartLinePrice line={line} />
                </strong>
              </span>
            </div>
          </div>
        ) : (
          <h6>{merchandise?.product?.title || ''}</h6>
        )}
        <div className="cart-variant">
          {(merchandise?.selectedOptions || []).map((option) => (
            <span key={option.name}>
              {option.name} : {option.value}
            </span>
          ))}
        </div>
        <div className="cart-edits dfx">
          <div className="cart-elinks">
            <CartLineQuantityAdjust line={line} />
            <ItemRemoveButton lineIds={[id]} />
          </div>
        </div>
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
        name=""
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
  checkoutUrl,
  
}) {
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
    currencyCode: 'USD',
  };

  let discountPercentage = 0;

  if (cost?.totalAmount?.amount >= 4.21 && cost?.totalAmount?.amount <= 6.21) {
    discountPercentage = 10;
  } else if (cost?.totalAmount?.amount >= 6.21) {
    discountPercentage = 20;
  }

  return (
    <div className="cartDrawer-cart-subtotal">
      <h6 className="text-up">Order Summary</h6>
      <ul>
        <li className="dfx flxspc">
          <span>SUBTOTAL</span>
          <span>
            {cost?.subtotalAmount?.amount ? (
              <Money withoutTrailingZeros data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </li>
        <li className="discountPrice">
          <span>DISCOUNTS {`GET ${discountPercentage}`}</span>
          <span>
            {discountAmount > 0 ? (
              <Money withoutTrailingZeros data={discountPrice} />
            ) : (
              '-'
            )}
          </span>
        </li>

        <li className="cart-total">
          <span className="dfx flxspc">
            <strong>TOTAL</strong>
            <strong>
              {cost?.totalAmount?.amount ? (
                <Money withoutTrailingZeros data={cost?.totalAmount} />
              ) : (
                '-'
              )}
            </strong>
          </span>
          <span>
            <small>(Inclusive of all taxes)</small>
          </span>
        </li>
      </ul>

      <CartCheckoutActions checkoutUrl={checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <Link to={checkoutUrl} target="_self">
      <button type="button" name="" className="btn chckc-btn" value="Checkout" >
        Checkout
      </button>
    </Link>
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

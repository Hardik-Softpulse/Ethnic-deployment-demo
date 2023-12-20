import {CartForm, Image, Money, flattenConnection} from '@shopify/hydrogen';
import {getProductPlaceholder} from '~/lib/placeholders';
import {Link} from './Link';
import {AddToCartButton} from './AddToCartButton';

function QuickView({onClose, product}) {
  const cardProduct = product?.variants ? product : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const {image, price, compareAtPrice, availableForSale} = firstVariant;

  const calculatePercentageDifference = (defcompareAtPrice, defprice) => {
    if (
      defcompareAtPrice !== null &&
      defprice !== null &&
      !isNaN(defcompareAtPrice) &&
      !isNaN(defprice)
    ) {
      const percentageDifference =
        ((defcompareAtPrice - defprice) / defcompareAtPrice) * 100;
      return percentageDifference.toFixed(0);
    } else {
      return null;
    }
  };

  const defcompareAtPrice = compareAtPrice?.amount;
  const defprice = price?.amount;

  const percentageDifferenceResult = calculatePercentageDifference(
    defcompareAtPrice,
    defprice,
  );

  const productAnalytics = {
    productGid: product.id,
    variantGid: firstVariant.id,
    name: product.title,
    variantName: firstVariant.title,
    brand: product.vendor,
    price: firstVariant.price.amount,
    quantity: 1,
  };

  

  return (
    <div>
      <span className="close_icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          onClick={onClose}
        >
          <path
            d="M2.28167 0.391468C1.7597 -0.130489 0.913438 -0.130489 0.391468 0.391468C-0.130489 0.913438 -0.130489 1.7597 0.391468 2.28167L8.10978 9.99996L0.391548 17.7182C-0.130409 18.2402 -0.130409 19.0865 0.391548 19.6084C0.913518 20.1303 1.75978 20.1303 2.28174 19.6084L9.99996 11.8901L17.7182 19.6084C18.2402 20.1303 19.0865 20.1303 19.6084 19.6084C20.1303 19.0865 20.1303 18.2402 19.6084 17.7182L11.8901 9.99996L19.6086 2.28167C20.1305 1.7597 20.1305 0.913438 19.6086 0.391468C19.0866 -0.130489 18.2403 -0.130489 17.7184 0.391468L9.99996 8.10978L2.28167 0.391468Z"
            fill="black"
          />
        </svg>
      </span>

      <div className="row flxspc flxanst productdtl">
        <Link
          className="quick-img"
          to={`/products/${product.handle}`}
          prefetch="intent"
        >
          <Image src={image?.url} alt={image?.altText} />
        </Link>
        <div className="quick-productdtl product-item">
          <h4>{product.title}</h4>
          <div className="product-price">
            <span className="s-price">
              <Money withoutTrailingZeros data={price} />
            </span>
            {compareAtPrice === null ? (
              ''
            ) : (
              <span className="o-price">
                <Money withoutTrailingZeros data={compareAtPrice} />
              </span>
            )}
            <span className="offer-price">
              {compareAtPrice === null ? (
                ''
              ) : (
                <span>{`(${percentageDifferenceResult}% OFF)`}</span>
              )}
            </span>
          </div>
          <CartLineQuantityAdjust />

          <AddToCartButton
            title="Add to cart"
            lines={[
              {
                merchandiseId: firstVariant.id,
                quantity: 1,
              },
            ]}
            variant="primary"
            data-test="add-to-cart"
            analytics={{
              products: [productAnalytics],
              totalValue: parseFloat(productAnalytics.price),
            }}
            className="btn btn-full add-cart-btn lp-0"
          />
        </div>
      </div>
    </div>
  );
}

export default QuickView;

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

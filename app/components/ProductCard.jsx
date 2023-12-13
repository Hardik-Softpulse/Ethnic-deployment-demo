import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';
import {Link} from './Link';
import {AddToCartButton} from './AddToCartButton';

export function ProductCard({
  product,
  label,
  className = 'all-collection-item',
  loading,
  onClick,
  quickAdd,
}) {
  let cardLabel;
  const cardProduct = product?.variants ? product : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const {image, price, compareAtPrice, availableForSale} = firstVariant;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price, compareAtPrice)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

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
    <div className={`product-item ${className}`}>
      <Link
        className="product-img"
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="intent"
      >
        <Image src={image?.url} alt={image?.altText} loading={loading} />
        {compareAtPrice === null
          ? ''
          : availableForSale == true && (
              <div className="product-tag sale-tag">{`Sale ${percentageDifferenceResult}%`}</div>
            )}
      </Link>
      <h5>
        <Link
          onClick={onClick}
          to={`/products/${product.handle}`}
          prefetch="intent"
          className="product-title"
        >
          {product.title}
        </Link>
      </h5>
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
        <span className="item-stocks">
          {availableForSale == true ? (
            <span style={{color: 'green'}}>In stock</span>
          ) : (
            <span style={{color: 'red'}}>Out stock</span>
          )}
        </span>
      </div>
      {/* {availableForSale == true && <button class="quickAdd">Quick Buy</button>}
      {console.log('availableForSale', availableForSale)}
      {console.log('quickAdd', quickAdd)} */}
      {availableForSale == true && (
        <AddToCartButton
          title="Quick Buy"
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
          className="btn add-cart-btn lp-0"
        />
      )}
    </div>
  );
}

function CompareAtPrice({data, className}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = ('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}

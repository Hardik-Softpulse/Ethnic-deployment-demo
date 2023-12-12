import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';
import {Link} from './Link';

export function ProductCard({
  product,
  label,
  className = 'all-collection-item',
  loading,
  onClick,
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

  return (
    <div className={`product-item ${className}`}>
      <Link
        className="product-img"
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="intent"
      >
        <Image src={image?.url} alt={image?.altText} loading={loading} />

        {availableForSale == true && (
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
    </div>
  );
}

function CompareAtPrice({data, className}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  console.log('currencyNarrowSymbol', currencyNarrowSymbol);

  const styles = ('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}

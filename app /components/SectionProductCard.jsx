import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';
import {Link} from './Link';

export function SectionProductCard({product, label, onClick}) {
  let cardLabel;
  const cardProduct = product?.variants ? product : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];
  if (!firstVariant) return null;
  const {image, price, compareAtPrice} = firstVariant;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price, compareAtPrice)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

  return (
    <div className="product-item">
      <Link
        className="product-img"
        onClick={onClick}
        to={`/products/${product.handle}`}
      >
        <Image src={image?.url} alt={`Picture of ${product.title}`} />
        {product.variants[0]?.onSale && (
          <div className="product-tag sale-tag">
            Sale {item.salePercentage}%
          </div>
        )}
      </Link>

      <h5>
        <Link
          onClick={onClick}
          to={`/products/${product.handle}`}
          className="product-title"
        >
          {product.title}
        </Link>
      </h5>
      <div className="product-price">
        <span className="s-price">
          <Money withoutTrailingZeros data={price} />
        </span>
        <span>
          {isDiscounted(price, compareAtPrice) && (
            <CompareAtPrice className="o-price" data={compareAtPrice} />
          )}
        </span>
      </div>
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

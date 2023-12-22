import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';
import {Link} from './Link';
import {useState} from 'react';
import {AddToCartButton} from './AddToCartButton';
import QuickView from './QuickView';

export function ProductCard({
  product,
  label,
  className = 'all-collection-item',
  loading,
  onClick,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [index, setIndex] = useState();
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

  const openModal = (productId) => {
    setIndex(productId);
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`product-item ${className}`}>
      <Link
        className="product-img "
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
        {/* <span className="item-stocks">
          {availableForSale == true ? (
            <span style={{color: 'green'}}>In stock</span>
          ) : (
            <span style={{color: 'red'}}>Out stock</span>
          )}
        </span> */}
        <div className="quickshop" onClick={() => openModal(product.id)}>
          <span className="ts-tooltip button-tooltip">Quick view</span>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 30 30"
            width="30px"
            height="30px"
          >
            <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
          </svg> */}
        </div>
      </div>

      <div
        id="ts-quickshop-modal"
        className={`ts-popup-modal ${isModalOpen ? 'show' : ''}`}
      >
        <div className="overlay" onClick={closeModal}></div>
        <QuickView onClose={closeModal} product={product} />
      </div>
      {/* {firstVariant.availableForSale && (
        <AddToCartButton
          title="Quick Add"
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
      )}
      {!firstVariant.availableForSale && (
        <button variant="secondary" className="btn btn-full soldOut">
          <span>Sold out</span>
        </button>
      )} */}
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

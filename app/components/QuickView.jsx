import {
  AnalyticsPageType,
  Money,
  VariantSelector,
  flattenConnection,
} from '@shopify/hydrogen';
import { useEffect, useRef, useState } from 'react';
import { getProductPlaceholder } from '~/lib/placeholders';
import { Rating } from '@mui/material';
import { AddToCartButton } from './AddToCartButton';
import { Swiper } from 'swiper/react';
import { ProductGallery } from './ProductGallery';
import SwiperCore from 'swiper';
import { Thumbs } from 'swiper/modules';

SwiperCore.use([Thumbs]);

export default function QuickView({ onClose, product }) {
  const cardProduct = product?.variants ? product : getProductPlaceholder();
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { media } = product;
  const variants = product?.variants.nodes;

  if (!cardProduct?.variants?.nodes?.length) return null;
  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const { price, compareAtPrice } = firstVariant;

  const handleCheckboxChange = (event, name, value) => {
    setSelectedVariant((prevSelectedVariant) => {
      return {
        ...prevSelectedVariant,
        [name]: value,
      };
    });
  };

  const selectedCartVariant = variants.find((variant) => {
    const selectedOption = variant.selectedOptions.every(
      (option) =>

        selectedVariant[option.name] !== undefined &&
        selectedVariant[option.name] === option.value
    );
    return selectedOption;
  });

  const selectedOptionVariant = selectedCartVariant
    ? selectedCartVariant
    : firstVariant;

  const productAnalytics = {
    productGid: product.id,
    variantGid: selectedOptionVariant?.id,
    name: product.title,
    variantName: selectedOptionVariant?.title,
    brand: product.vendor,
    price: selectedOptionVariant?.price.amount,
    quantity: quantity,
  };

  const data = {
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: productAnalytics,
      totalValue: selectedOptionVariant?.price.amount,
    },
  };

  const productAnalytic = {
    ...data.analytics.products
  };

  const calculatePercentageDifference = (compareAtPrice, price) => {
    if (
      compareAtPrice !== null &&
      price !== null &&
      !isNaN(compareAtPrice) &&
      !isNaN(price)
    ) {
      const percentageDifference =
        ((compareAtPrice - price) / compareAtPrice) * 100;
      return percentageDifference.toFixed(0);
    } else {
      return null;
    }
  };

  const defcomparePrice = selectedOptionVariant?.compareAtPrice?.amount;
  const defprice = selectedOptionVariant?.price?.amount;

  const percentageDifferenceResult = calculatePercentageDifference(
    defcomparePrice,
    defprice,
  );

  const isOutOfStock = selectedCartVariant?.availableForSale;

  // useEffect(() => {
  //   // Initialize the main product slider
  //   const productSlider = new Swiper('.product-i1slider', {
  //     thumbs: {
  //       swiper: new Swiper('.thumb-i1slider', {
  //         slidesPerView: 'auto',
  //       }),
  //     },
  //   });

  //   // Get thumb slides and add click event listeners
  //   const thumbSlides = document.querySelectorAll('.thumb-i1slide');
  //   thumbSlides.forEach((thumbSlide, index) => {
  //     thumbSlide.addEventListener('click', () => {
  //       productSlider.slideTo(index);
  //     });
  //   });

  //   // Cleanup function to destroy Swiper instances when component unmounts
  //   return () => {
  //     // Use the `destroy` method from the Swiper instance
  //     productSlider.destroy();
  //   };
  // }, []);


  const handleIncrement = (e) => {
    e.preventDefault();
    setQuantity(quantity + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="quickshop-container popup-container">
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
      <div className="quickshop-content">
        <div className="product-images flx-auto">
          <div className="product-i1slider swiper-container">
            <ProductGallery media={media.nodes} />
          </div>
          <div className="thumb-i1slider swiper-container">
            <div className="swiper-wrapper">
              {media.nodes.map((img) => (
                <div className="swiper-slide thumb-i1slide" key={img.id}>
                  <img src={img.image.url} alt={img.image.alt} />
                </div>
              ))}

            </div>
          </div>
        </div>
        <div className="product-dscrptn flx-cover">
          <h4>{product.title}</h4>
          <div className="dscrptn-xs lp-05">{product.description}</div>
          <div className="product-review dfx lp-05">
            <Rating name="simple-controlled" readOnly />
            <span> Reviews</span>
          </div>
          <div className="product-i1price">
            <span className="s-price">
              <Money measurement withoutTrailingZeros data={price} />
            </span>

            <span className="o-price">
              {compareAtPrice === null ? (
                ''
              ) : (
                <Money withoutTrailingZeros data={compareAtPrice} />
              )}
            </span>
            <span className="offer-price">
              {compareAtPrice === null ? (
                ''
              ) : (
                <span>{`(${percentageDifferenceResult}% OFF)`}</span>
              )}
            </span>
          </div>
          <form>
            <VariantSelector
              handle={product.handle}
              options={product.options}
              variants={variants}
            >
              {({ option }) => {

                return (
                  <div
                    className="swatch clearfix"
                    data-option-index={option.name}
                    key={option}
                  >
                    <div className="swatch-title">
                      <strong>{option.name}</strong>
                    </div>
                    {option.values.length > 7 ? (
                      <div
                        key={option}
                        className={`swatch-element ${selectedVariant[option.name] === value ? 'available' : ''}`}
                        title={option.values[0]}
                      >
                        <input
                          type="checkbox"
                          name={`option-${option.name}`}
                          value={option.values[0]}
                          id={`swatch-${option.name}-${option.values[0]}`}
                          checked={selectedVariant[option.name] === value}
                          onChange={(event) =>
                            handleCheckboxChange(event, option.name, value)
                          }
                        />
                        <label htmlFor={`swatch-${option.name}-${option.values[0]}`}>
                          {option.values[0]}
                        </label>
                      </div>
                    ) : (
                      option.values.map(({ value, index }) => (
                        <div
                          key={index}
                          className={`swatch-element ${selectedVariant[option.name] === value ? 'available' : ''}`}
                          title={value}
                        >
                          <input
                            type="checkbox"
                            name={`option-${option.name}`}
                            value={value}
                            id={`swatch-${index}-${value}`}
                            checked={selectedVariant[option.name] === value}
                            onChange={(event) =>
                              handleCheckboxChange(event, option.name, value)
                            }
                          />
                          <label htmlFor={`swatch-${index}-${value}`}>
                            {value}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                );
              }}
            </VariantSelector>

            <div className="quantity-box">
              <button onClick={(e) => handleDecrement(e)}>-</button>
              <span>{quantity}</span>
              <button onClick={(e) => handleIncrement(e)}>+</button>
            </div>

            <>
              {selectedOptionVariant?.availableForSale === false ? (
                <button
                  variant="secondary"
                  disabled={isOutOfStock}
                  className="btn btn-full quicksoldOut"
                >
                  <span>Sold out</span>
                </button>
              ) : (
                <AddToCartButton
                  title="Add to cart"
                  lines={[
                    {
                      merchandiseId: selectedOptionVariant?.id,
                      quantity: parseInt(quantity, 10)

                    },
                  ]}
                  variant="primary"
                  data-test="add-to-cart"
                  analytics={{
                    products: [productAnalytic],
                    totalValue: parseFloat(productAnalytic.price),
                  }}
                  className="btn btn-full add-cart-btn lp-0"
                />
              )}
            </>

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
          </form>
        </div>
      </div>
    </div >
  );
}


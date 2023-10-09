import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData} from '@remix-run/react';
import {
  AnalyticsPageType,
  Money,
  VariantSelector,
  getSelectedProductOptions,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {Suspense, useEffect, useState} from 'react';
import {
  AddToCartButton,
  FeaturedCollections,
  ProductGallery,
  NewArrival,
} from '~/components';
import {getExcerpt} from '~/lib/utils';
import Swiper from 'swiper';
import Productsec from '../img/Productsec.jpg';

export const headers = routeHeaders;

export async function loader({params, request, context}) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const {shop, product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  const variants = context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: productHandle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }

  if (!product.selectedVariant) {
    return redirectToFirstVariant({product, request});
  }

  const recommended = getRecommendedProducts(context.storefront, product.id);
  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  return defer({
    variants,
    product,
    shop,
    storeDomain: shop.primaryDomain.url,
    recommended,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
    seo,
  });
}

function redirectToFirstVariant({product, request}) {
  const searchParams = new URLSearchParams(new URL(request.url).search);
  const firstVariant = product.variants.nodes[0];
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }

  throw redirect(`/products/${product.handle}?${searchParams.toString()}`, 302);
}

export default function Product() {
  const {product, shop, recommended, variants} = useLoaderData();
  const {media, title, vendor, descriptionHtml} = product;
  const {shippingPolicy, refundPolicy} = shop;

  useEffect(() => {
    const thumbSlider = new Swiper('.thumb-i1slider', {
      slidesPerView: 'auto',
    });

    const productSlider = new Swiper('.product-i1slider', {
      thumbs: {
        swiper: thumbSlider,
      },
    });

    const thumbSlides = document.querySelectorAll('.thumb-i1slide');
    thumbSlides.forEach((thumbSlide, index) => {
      thumbSlide.addEventListener('click', () => {
        productSlider.slideTo(index);
      });
    });
  }, []);

  return (
    <div className="product-page clearfix">
      <div className="breadcrumb m-0">
        <div className="container">
          <span>
            <a href="#">Home</a>
          </span>
          <span>products</span>
        </div>
      </div>
      <div className="product-info-sct">
        <div className="container dfx">
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
          <Suspense fallback={<ProductForm variants={[]} />}>
            <Await
              errorElement="There was a problem loading related products"
              resolve={variants}
            >
              {(resp) => (
                <ProductForm variants={resp.product?.variants.nodes || []} />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="product-srvc-sct">
        <div className="container">
          <div className="row">
            <div className="srvc-item">
              <h5>Expected Delivery Time</h5>
              <p>
                7 days; Actual time may vary depending on other items in your
                order
              </p>
            </div>
            <div className="srvc-item">
              <h5>Cash/Card on delivery available</h5>
              <p>Available for orders between Rs. 699- Rs. 20,000</p>
            </div>
            <div className="srvc-item">
              <h5>Easy 15 days returns and 15 days exchanges</h5>
              <p>Choose to return within 15 days or exchange within 15 days.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="product-feature-sct product-sec">
        <div className="container">
          <div className="col-block">
            <div className="col-item">
              <img src={Productsec} />
            </div>
            <div className="col-item">
              <h2>WE CREATE FASHION</h2>
              <div className="divider"></div>
              <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
                cot uodo ligul get dolor. Aenean massa. Cum sociis Theme
                natoquepe natibus et magnis dis parturient montes, nascetur
                ridiculus mus. Eti am rhoncus. Maecenas tempus, tellus eget
                condimentum rhoncus, sem quam semper libero, sit amet adipiscing
                sem neque sed ipsum.
              </p>
            </div>
          </div>
          {/* <div className="col-block">
            <div className="col-item">
              <img src="img/product-i1.jpg" />
            </div>
            <div className="col-item">
              <h2>Shopify theme NMD_R1 Shoes</h2>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </p>
              <p>
                When an unknown printer took a galley of type and scrambled it
                to make a type specimen book. It has survived not only five
                centuries, but also the leap into electronic typesetting,
                remaining essentially unchanged.
              </p>
            </div>
          </div> */}
        </div>
      </div>

      <Suspense>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(products) => (
            <FeaturedCollections title="Related Products" products={products} />
          )}
        </Await>
      </Suspense>

      <Suspense>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(product) => (
            <NewArrival
              title="Recently viewed products"
              product={product.nodes}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

export function ProductForm({variants}) {
  const {product, shop, analytics} = useLoaderData();
  const {descriptionHtml} = product;
  const {shippingPolicy, refundPolicy} = shop;

  const selectedVariant = product.selectedVariant;
  const isOutOfStock = !selectedVariant?.availableForSale;

  const productAnalytics = {
    ...analytics.products[0],
    quantity: 1,
  };


  const isOptionSelected = (optionName, optionValue) => {
    console.log('optionName', optionName);
    console.log('optionValue', optionValue);
    return (
      selectedVariant &&
      selectedVariant.selectedOptions.some((option) => {
        console.log('option.name === optionName', option.name === optionName);
        return option.name === optionName && option.value === optionValue;
      })
    );
  };

  return (
    <div className="product-dscrptn flx-cover">
      <h4>{product.title}</h4>
      <div className="dscrptn-xs lp-05">{product.description}</div>
      <div className="product-review dfx lp-05">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path
            d="M969,293l2.445,5.308L977,299.11l-4.043,4.088L973.944,309,969,306.222,964.056,309l0.987-5.806L961,299.11l5.554-.807Z"
            transform="translate(-961 -293)"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path
            d="M969,293l2.445,5.308L977,299.11l-4.043,4.088L973.944,309,969,306.222,964.056,309l0.987-5.806L961,299.11l5.554-.807Z"
            transform="translate(-961 -293)"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path
            d="M969,293l2.445,5.308L977,299.11l-4.043,4.088L973.944,309,969,306.222,964.056,309l0.987-5.806L961,299.11l5.554-.807Z"
            transform="translate(-961 -293)"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path
            d="M969,293l2.445,5.308L977,299.11l-4.043,4.088L973.944,309,969,306.222,964.056,309l0.987-5.806L961,299.11l5.554-.807Z"
            transform="translate(-961 -293)"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path
            d="M969,293l2.445,5.308L977,299.11l-4.043,4.088L973.944,309,969,306.222,964.056,309l0.987-5.806L961,299.11l5.554-.807Z"
            transform="translate(-961 -293)"
          />
        </svg>
        <span>5 Reviews</span>
      </div>
      <div className="product-i1price">
        <span className="s-price">
          <Money
            measurement
            withoutTrailingZeros
            data={selectedVariant.price}
          />
        </span>
        <span className="o-price">
        {/* <Money
            measurement
            withoutTrailingZeros
            data={selectedVariant.compareAtPrice}
          /> */}

        </span>
      </div>
      <form>
        <VariantSelector
          handle={product.handle}
          options={product.options}
          variants={variants}
        >
          {({option}) => {
            return (
              <div className="swatch clearfix" data-option-index="1">
                <div className="swatch-title">
                  <strong>{option.name}</strong>
                </div>
                {option.values.length > 7 ? (
                  <div
                    key={index}
                    data-value={value}
                    className={`swatch-element ${
                      isOptionSelected(option.name, value) ? 'available' : ''
                    }`}
                    title={value}
                  >
                    <input
                      type="checked"
                      name={`option-${option.name}`}
                      value={value}
                      id="swatch-1-size"
                      checked={selectedVariant?.[option.name] === value}
                    />
                    <label htmlFor="swatch-1-size">{value}</label>
                  </div>
                ) : (
                  option.values.map(({value, index, to}) => (
                    <div
                      key={index}
                      data-value={value}
                      className={`swatch-element ${
                        isOptionSelected(option.name, value) ? 'available' : ''
                      }`}
                      title={value}
                    >
                      <Link
                        key={option.name + value}
                        to={to}
                        preventScrollReset
                        prefetch="intent"
                        replace
                      >
                        <input
                          type="checked"
                          name={`option-${option.name}`}
                          value={value}
                          id="swatch-1-size"
                          checked={selectedVariant?.[option.name] === value}
                        />
                        <label htmlFor="swatch-1-size">{value}</label>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            );
          }}
        </VariantSelector>

        <div className="size-chart-link clearfix">
          <a href="#" className="f-left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 31 10"
              width="31"
              height="10"
            >
              <path d="M28.3 0L28.3 4.29L26.96 4.29L26.96 0L24.26 0L24.26 2.86L22.91 2.86L22.91 0L20.22 0L20.22 2.86L18.87 2.86L18.87 0L16.17 0L16.17 4.29L14.83 4.29L14.83 0L12.13 0L12.13 2.86L10.78 2.86L10.78 0L8.09 0L8.09 2.86L6.74 2.86L6.74 0L4.04 0L4.04 4.29L2.7 4.29L2.7 0L0 0L0 10L31 10L31 0L28.3 0Z" />
            </svg>{' '}
            Size chart
          </a>
        </div>
        {selectedVariant && (
          <>
            {isOutOfStock ? (
              <button
                variant="secondary"
                disabled={isOutOfStock}
                className="btn btn-full soldOut"
              >
                <span>Sold out</span>
              </button>
            ) : (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                  },
                ]}
                variant="primary"
                data-test="add-to-cart"
                analytics={{
                  products: [productAnalytics],
                  totalValue: parseFloat(productAnalytics.price),
                }}
              />
            )}
          </>
        )}

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
        <div className="product-collapse-tabs">
          {descriptionHtml && (
            <ProductDetail title="Product Details" content={descriptionHtml} />
          )}
          {shippingPolicy?.body && (
            <ProductDetail
              title="Shipping"
              content={getExcerpt(shippingPolicy.body)}
              learnMore={`/policies/${shippingPolicy.handle}`}
            />
          )}
          {refundPolicy?.body && (
            <ProductDetail
              title="Returns"
              content={getExcerpt(refundPolicy.body)}
              learnMore={`/policies/${refundPolicy.handle}`}
            />
          )}
        </div>
      </form>
    </div>
  );
}

function ProductDetail({title, content, learnMore}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="cllps-group">
      <div
        className={`cllps-title lp-05 ${isOpen ? 'active' : ''}`}
        onClick={toggleDropdown}
      >
        <strong>{title}</strong> <span></span>
      </div>
      {isOpen && (
        <div className="cllps-content" style={{display: 'block'}}>
          <p dangerouslySetInnerHTML={{__html: content}}></p>
        </div>
      )}
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ...ProductVariantFragment
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const VARIANTS_QUERY = `#graphql
  query variants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      variants(first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

async function getRecommendedProducts(storefront, productId) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}

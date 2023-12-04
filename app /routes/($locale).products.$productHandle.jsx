import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData} from '@remix-run/react';
import {
  AnalyticsPageType,
  Money,
  Pagination,
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
  FeaturedProducts,
  ProductGallery,
  NewArrival,
} from '~/components';
import {getExcerpt} from '~/lib/utils';
import Swiper from 'swiper';
import Productsec from '../img/Productsec.jpg';
import Rating from '@mui/material/Rating';
import {ResentlyView, ReviewCard} from '../components';

export const headers = routeHeaders;

export async function loader({params, request, context}) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const {shop, product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions,
    },
  });

  const variants = context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: productHandle,
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
  const {media} = product;
  const [selectedReviewType, setSelectedReviewType] = useState('Yotpo');

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
        </div>
      </div>

      <Suspense>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(product) => (
            <NewArrival title="Related Products" product={product.nodes} />
          )}
        </Await>
      </Suspense>
      <ResentlyView product={product.variants.nodes} />
      <div className="container review-container ">
        <h2 className="h2 text-up text-center">Customer Reviews</h2>
        <ReviewCard reviewType={selectedReviewType} product={product} />
      </div>
    </div>
  );
}

export function ProductForm({variants}) {
  const {product, shop, analytics} = useLoaderData();
  const {descriptionHtml} = product;
  const {shippingPolicy, refundPolicy} = shop;
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  const selectedVariant = product.selectedVariant;
  const isOutOfStock = !selectedVariant?.availableForSale;

  const productAnalytics = {
    ...analytics.products[0],
    quantity: 1,
  };

  const isOptionSelected = (optionName, optionValue) => {
    return (
      selectedVariant &&
      selectedVariant.selectedOptions.some((option) => {
        return option.name === optionName && option.value === optionValue;
      })
    );
  };

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
  };

  // const calculatePercentageDifference = (compareAtPrice, price) => {
  //   if (
  //     compareAtPrice !== null &&
  //     price !== null &&
  //     !isNaN(compareAtPrice) &&
  //     !isNaN(price)
  //   ) {
  //     const percentageDifference =
  //       ((compareAtPrice - price) / compareAtPrice) * 100;
  //     return percentageDifference;
  //   } else {
  //     return null;
  //   }
  // };

  // const compareAtPrice = selectedVariant?.compareAtPrice?.amount;
  // const price = selectedVariant?.price?.amount;

  // const percentageDifference = calculatePercentageDifference(
  //   compareAtPrice,
  //   price,
  // ).toFixed(0);

  return (
    <>
      <div className="product-dscrptn flx-cover">
        <h4>{product.title}</h4>
        <div className="dscrptn-xs lp-05">{product.description}</div>
        <div className="product-review dfx lp-05">
          <Rating name="simple-controlled" readOnly />
          <span> Reviews</span>
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
            {selectedVariant?.compareAtPrice === null ? (
              ''
            ) : (
              <Money
                withoutTrailingZeros
                data={selectedVariant?.compareAtPrice}
              />
            )}
          </span>
        </div>
        <form>
          <VariantSelector
            handle={product.handle}
            options={product.options}
            variants={variants}
          >
            {({option, id}) => {
              return (
                <div className="swatch clearfix" data-option-index="1" key={id}>
                  <div className="swatch-title">
                    <strong>{option.name}</strong>
                  </div>
                  {option.values.length > 7 ? (
                    <div
                      key={id}
                      data-value={value}
                      className={`swatch-element ${
                        isOptionSelected(option.name, value) ? 'available' : ''
                      }`}
                      title={value}
                    >
                      <input
                        type="checkbox"
                        name={`option-${option.name}`}
                        value={value}
                        id={`swatch-${id}-${value}`}
                        checked={isOptionSelected(option.name, value)}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="swatch-1-size">{value}</label>
                    </div>
                  ) : (
                    option.values.map(({value, index, to}) => (
                      <div
                        key={index}
                        data-value={value}
                        className={`swatch-element ${
                          isOptionSelected(option.name, value)
                            ? 'available'
                            : ''
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
                            type="checkbox"
                            name={`option-${option.name}`}
                            value={value}
                            id={`swatch-${index}-${value}`}
                            checked={isOptionSelected(option.name, value)}
                            onChange={handleCheckboxChange}
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
            <div
              className="f-left"
              onClick={() => setIsSizeChartOpen(!isSizeChartOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 31 10"
                width="31"
                height="10"
              >
                <path d="M28.3 0L28.3 4.29L26.96 4.29L26.96 0L24.26 0L24.26 2.86L22.91 2.86L22.91 0L20.22 0L20.22 2.86L18.87 2.86L18.87 0L16.17 0L16.17 4.29L14.83 4.29L14.83 0L12.13 0L12.13 2.86L10.78 2.86L10.78 0L8.09 0L8.09 2.86L6.74 2.86L6.74 0L4.04 0L4.04 4.29L2.7 4.29L2.7 0L0 0L0 10L31 10L31 0L28.3 0Z" />
              </svg>
              Size chart
            </div>
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
              <ProductDetail
                title="Product Details"
                content={descriptionHtml}
              />
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
      <div className={`size-chart-popup ${isSizeChartOpen ? 'open' : ''}`}>
        <div className="size-chart-content">
          <div className="popoup_hdr">
            <h4 className="text-center mb-0">Size Chart</h4>
            <span
              className="close_icon"
              onClick={() => setIsSizeChartOpen(!isSizeChartOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M2.28167 0.391468C1.7597 -0.130489 0.913438 -0.130489 0.391468 0.391468C-0.130489 0.913438 -0.130489 1.7597 0.391468 2.28167L8.10978 9.99996L0.391548 17.7182C-0.130409 18.2402 -0.130409 19.0865 0.391548 19.6084C0.913518 20.1303 1.75978 20.1303 2.28174 19.6084L9.99996 11.8901L17.7182 19.6084C18.2402 20.1303 19.0865 20.1303 19.6084 19.6084C20.1303 19.0865 20.1303 18.2402 19.6084 17.7182L11.8901 9.99996L19.6086 2.28167C20.1305 1.7597 20.1305 0.913438 19.6086 0.391468C19.0866 -0.130489 18.2403 -0.130489 17.7184 0.391468L9.99996 8.10978L2.28167 0.391468Z"
                  fill="black"
                ></path>
              </svg>
            </span>
          </div>
          <div className="size_chart_tabel">
            <h6>Clothes Pant and Dress Size</h6>
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Pant Size(in)</th>
                  <th>US</th>
                  <th>UK</th>
                  <th>AUS</th>
                  <th>EU</th>
                  <th>ITY</th>
                  <th>JPN</th>
                  <th>CAN</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>XXS</td>
                  <td>24</td>
                  <td>0</td>
                  <td>4</td>
                  <td>4</td>
                  <td>32</td>
                  <td>36,38</td>
                  <td>XXS</td>
                  <td>XXS</td>
                </tr>
                <tr>
                  <td>XS</td>
                  <td>25,26</td>
                  <td>2</td>
                  <td>6</td>
                  <td>6</td>
                  <td>34</td>
                  <td>38</td>
                  <td>XS</td>
                  <td>XS</td>
                </tr>
                <tr>
                  <td>S</td>
                  <td>27,28</td>
                  <td>4</td>
                  <td>8</td>
                  <td>8</td>
                  <td>36</td>
                  <td>40</td>
                  <td>S</td>
                  <td>S</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>29,30</td>
                  <td>6</td>
                  <td>10</td>
                  <td>10</td>
                  <td>38</td>
                  <td>42</td>
                  <td>M</td>
                  <td>M</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>30</td>
                  <td>8</td>
                  <td>12</td>
                  <td>12</td>
                  <td>40</td>
                  <td>44</td>
                  <td>L</td>
                  <td>L</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>31,32</td>
                  <td>10</td>
                  <td>14</td>
                  <td>14</td>
                  <td>42</td>
                  <td>46</td>
                  <td>XL</td>
                  <td>XL</td>
                </tr>
                <tr>
                  <td>XXL</td>
                  <td>32</td>
                  <td>12</td>
                  <td>16</td>
                  <td>16</td>
                  <td>44</td>
                  <td>48</td>
                  <td>XXL</td>
                  <td>XXL</td>
                </tr>
              </tbody>
            </table>
            <h6>Shoes</h6>
            <table>
              <thead>
                <tr>
                  <th>US</th>
                  <th>UK</th>
                  <th>AUS</th>
                  <th>EU</th>
                  <th>JPN</th>
                  <th>CAN</th>
                  <th>cm</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>5</td>
                  <td>3</td>
                  <td>5</td>
                  <td>35.5</td>
                  <td>22</td>
                  <td>5</td>
                  <td>22.1</td>
                </tr>
                <tr>
                  <td>5.5</td>
                  <td>3.5</td>
                  <td>5.5</td>
                  <td>36</td>
                  <td>22.5</td>
                  <td>5.5</td>
                  <td>22.4</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>4</td>
                  <td>6</td>
                  <td>36.5</td>
                  <td>23</td>
                  <td>6</td>
                  <td>22.9</td>
                </tr>
                <tr>
                  <td>6.5</td>
                  <td>4.5</td>
                  <td>6.5</td>
                  <td>37</td>
                  <td>23.5</td>
                  <td>6.5</td>
                  <td>22.3</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>5</td>
                  <td>7</td>
                  <td>37.5</td>
                  <td>23.5</td>
                  <td>7</td>
                  <td>23.7</td>
                </tr>
                <tr>
                  <td>7.5</td>
                  <td>5.5</td>
                  <td>7.5</td>
                  <td>38</td>
                  <td>24</td>
                  <td>7.5</td>
                  <td>24.1</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>6</td>
                  <td>8</td>
                  <td>38.5</td>
                  <td>24.5</td>
                  <td>8</td>
                  <td>24.6</td>
                </tr>
                <tr>
                  <td>8.5</td>
                  <td>6.5</td>
                  <td>8.5</td>
                  <td>39</td>
                  <td>25</td>
                  <td>8.5</td>
                  <td>24.9</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>7</td>
                  <td>9</td>
                  <td>39.5</td>
                  <td>25.5</td>
                  <td>9</td>
                  <td>25.4</td>
                </tr>
                <tr>
                  <td>9.5</td>
                  <td>7.5</td>
                  <td>9.5</td>
                  <td>40</td>
                  <td>26</td>
                  <td>9.5</td>
                  <td>25.9</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>8</td>
                  <td>10</td>
                  <td>40.5</td>
                  <td>26</td>
                  <td>10</td>
                  <td>26.2</td>
                </tr>
                <tr>
                  <td>10.5</td>
                  <td>8.5</td>
                  <td>10.5</td>
                  <td>41</td>
                  <td>26.5</td>
                  <td>10.5</td>
                  <td>26.7</td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>9</td>
                  <td>11</td>
                  <td>41.5</td>
                  <td>27</td>
                  <td>11</td>
                  <td>27.1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
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
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) {
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
      media(first: 10) {
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
    $handle: String!
  ) {
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
  ) {
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

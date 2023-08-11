import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {
  flattenConnection,
  AnalyticsPageType,
  getPaginationVariables,
  Pagination,
  Money,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

export const headers = routeHeaders;

export async function loader({params, request, context}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  const {collectionHandle} = params;

  invariant(collectionHandle, 'Missing collectionHandle param');

  const searchParams = new URL(request.url).searchParams;
  const knownFilters = ['productVendor', 'productType'];
  const available = 'available';
  const variantOption = 'variantOption';
  const {sortKey, reverse} = getSortValuesFromParam(searchParams.get('sort'));
  const filters = [];
  const appliedFilters = [];

  for (const [key, value] of searchParams.entries()) {
    if (available === key) {
      filters.push({available: value === 'true'});
      appliedFilters.push({
        label: value === 'true' ? 'In stock' : 'Out of stock',
        urlParam: {
          key: available,
          value,
        },
      });
    } else if (knownFilters.includes(key)) {
      filters.push({[key]: value});
      appliedFilters.push({label: value, urlParam: {key, value}});
    } else if (key.includes(variantOption)) {
      const [name, val] = value.split(':');
      filters.push({variantOption: {name, value: val}});
      appliedFilters.push({label: val, urlParam: {key, value}});
    }
  }

  // Builds min and max price filter since we can't stack them separately into
  // the filters array. See price filters limitations:
  // https://shopify.dev/custom-storefronts/products-collections/filter-products#limitations
  if (searchParams.has('minPrice') || searchParams.has('maxPrice')) {
    const price = {};
    if (searchParams.has('minPrice')) {
      price.min = Number(searchParams.get('minPrice')) || 0;
      appliedFilters.push({
        label: `Min: $${price.min}`,
        urlParam: {key: 'minPrice', value: searchParams.get('minPrice')},
      });
    }
    if (searchParams.has('maxPrice')) {
      price.max = Number(searchParams.get('maxPrice')) || 0;
      appliedFilters.push({
        label: `Max: $${price.max}`,
        urlParam: {key: 'maxPrice', value: searchParams.get('maxPrice')},
      });
    }
    filters.push({
      price,
    });
  }

  const {collection, collections} = await context.storefront.query(
    COLLECTION_QUERY,
    {
      variables: {
        ...paginationVariables,
        handle: collectionHandle,
        filters,
        sortKey,
        reverse,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    },
  );

  if (!collection) {
    throw new Response('collection', {status: 404});
  }

  const seo = seoPayload.collection({collection, url: request.url});

  return json({
    collection,
    appliedFilters,
    collections: flattenConnection(collections),
    analytics: {
      pageType: AnalyticsPageType.collection,
      collectionHandle,
      resourceId: collection.id,
    },
    seo,
  });
}

export default function Collection() {
  const {collection, collections, appliedFilters} = useLoaderData();

  return (
    <div className="collection-page">
      <div className="breadcrumb">
        <div className="container">
          <span>
            <a href="#">Home</a>
          </span>
          <span>products</span>
        </div>
      </div>
      <div className="cllctn-page-in pb-60">
        <div className="container">
          <h2 className="page-title text-up text-center">{collection.title}</h2>
          <div className="row m-15">
            <div className="cllctn-sidebar">
              <a href="#" className="reset-act">
                Reset
              </a>
              <h3 className="text-up lp-05">Filter</h3>
              <div className="filter-option">
                <h6 className="filter-title">Size</h6>
                <div className="filter-list clearfix">
                  <div className="filter-item">
                    <input type="checkbox" name="size" id="size-1" checked="" />
                    <label htmlFor="size-1" className="filter-act">
                      1
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="size" id="size-2" />
                    <label htmlFor="size-2" className="filter-act">
                      2
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="size" id="size-3" />
                    <label htmlFor="size-3" className="filter-act">
                      3
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="size" id="size-4" />
                    <label htmlFor="size-4" className="filter-act">
                      4
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="size" id="size-5" />
                    <label htmlFor="size-5" className="filter-act">
                      5
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="size" id="size-6" />
                    <label htmlFor="size-6" className="filter-act">
                      6
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="size" id="size-7" />
                    <label htmlFor="size-7" className="filter-act">
                      7
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="size" id="size-8" />
                    <label htmlFor="size-8" className="filter-act">
                      8
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="size" id="size-9" />
                    <label htmlFor="size-9" className="filter-act">
                      9
                    </label>
                  </div>
                </div>
              </div>
              <div className="filter-option filter-color">
                <h6 className="filter-title">Color</h6>
                <div className="filter-list clearfix">
                  <div className="filter-item">
                    <input
                      type="checkbox"
                      name="color"
                      id="color-1"
                      checked=""
                    />
                    <label
                      htmlFor="color-1"
                      className="filter-act"
                      style={{backgroundColor: '#000'}}
                    ></label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="color" id="color-2" />
                    <label
                      htmlFor="color-2"
                      className="filter-act"
                      style={{backgroundColor: '#808080'}}
                    ></label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="color" id="color-3" />
                    <label
                      htmlFor="color-3"
                      className="filter-act"
                      style={{backgroundColor: '#FFF'}}
                    ></label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="color" id="color-4" />
                    <label
                      htmlFor="color-4"
                      className="filter-act"
                      style={{backgroundColor: '#ff0000'}}
                    ></label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="color" id="color-5" />
                    <label
                      htmlFor="color-5"
                      className="filter-act"
                      style={{backgroundColor: '#ff9900'}}
                    ></label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="color" id="color-6" />
                    <label
                      htmlFor="color-6"
                      className="filter-act"
                      style={{backgroundColor: '#a30000'}}
                    ></label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="color" id="color-7" />
                    <label
                      htmlFor="color-7"
                      className="filter-act"
                      style={{backgroundColor: '#33cc00'}}
                    ></label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="color" id="color-8" />
                    <label
                      htmlFor="color-8"
                      className="filter-act"
                      style={{backgroundColor: '#0000cc'}}
                    ></label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="color" id="color-9" />
                    <label htmlFor="color-9"
                      className="filter-act"
                      style={{backgroundColor: '#00ffcc'}}
                    ></label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="color" id="color-10" />
                    <label
                      htmlFor="color-10"
                      className="filter-act"
                      style={{backgroundColor: '#9933cc'}}
                    ></label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="color" id="color-11" />
                    <label
                      htmlFor="color-11"
                      className="filter-act"
                      style={{backgroundColor: '#ff66cc'}}
                    ></label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="color" id="color-12" />
                    <label
                      htmlFor="color-12"
                      className="filter-act"
                      style={{backgroundColor: '#deb887'}}
                    ></label>
                  </div>
                </div>
              </div>
              <div className="filter-option">
                <h6 className="filter-title">Product Type</h6>
                <div className="filter-list clearfix">
                  <div className="filter-item">
                    <input type="checkbox" name="type" id="type-1" />
                    <label htmlFor="type-1" className="filter-act">
                      Boots
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="type" id="type-2" checked="" />
                    <label htmlFor="type-2" className="filter-act">
                      Casuals
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="type" id="type-3" />
                    <label htmlFor="type-3" className="filter-act">
                      Flip Flops
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="type" id="type-4" />
                    <label htmlFor="type-4" className="filter-act">
                      Formals
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="type" id="type-5" />
                    <label htmlFor="type-5" className="filter-act">
                      Loafers
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="type" id="type-6" />
                    <label htmlFor="type-6" className="filter-act">
                      Flip Flops
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="type" id="type-7" />
                    <label htmlFor="type-7" className="filter-act">
                      Slippers
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="type" id="type-8" />
                    <label htmlFor="type-8" className="filter-act">
                      Sneakers
                    </label>
                  </div>
                </div>
              </div>
              <div className="filter-option">
                <h6 className="filter-title">Price</h6>
                <div className="filter-list clearfix">
                  <div className="filter-item">
                    <input type="checkbox" name="price" id="price-1" />
                    <label htmlFor="price-1" className="filter-act">
                      $0 - $50
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="price" id="price-2" />
                    <label htmlFor="price-2" className="filter-act">
                      $50 - $100
                    </label>
                  </div>
                  <div className="filter-item">
                    <input
                      type="checkbox"
                      name="price"
                      id="price-3"
                      checked=""
                    />
                    <label htmlFor="price-3" className="filter-act">
                      $100 - $150
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="price" id="price-4" />
                    <label htmlFor="price-4" className="filter-act">
                      $150 - $200
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="price" id="price-5" />
                    <label htmlFor="price-5" className="filter-act">
                      $200 - $250
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="price" id="price-6" />
                    <label htmlFor="price-6" className="filter-act">
                      $250 - $300
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="price" id="price-7" />
                    <label htmlFor="price-7" className="filter-act">
                      $350 - $400
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="price" id="price-8" />
                    <label htmlFor="price-8" className="filter-act">
                      $400 or more
                    </label>
                  </div>
                </div>
              </div>
              <div className="filter-option">
                <h6 className="filter-title">Discount</h6>
                <div className="filter-list clearfix">
                  <div className="filter-item">
                    <input type="checkbox" name="disc" id="disc-1" />
                    <label htmlFor="disc-1" className="filter-act">
                      30%
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="disc" id="disc-2" checked="" />
                    <label htmlFor="disc-2" className="filter-act">
                      40%
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="disc" id="disc-3" />
                    <label htmlFor="disc-3" className="filter-act">
                      50%
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="disc" id="disc-4" />
                    <label htmlFor="disc-4" className="filter-act">
                      55%
                    </label>
                  </div>
                  <div className="filter-item">
                    <input type="checkbox" name="disc" id="disc-5" />
                    <label htmlFor="disc-5" className="filter-act">
                      60%
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="cllctn-list">
              <div className="row m-15">
                {collection.products.nodes.map((product, index) => (
                  <div className="product-item" key={index}>
                    {product.variants.nodes.map((item) => (
                      <>
                      {console.log('item', item)}
                        <a href={`/products/${item.product.handle}`} className="product-img">
                          <img src={item?.image?.url} alt="product Image"/>
                          {product.variants[0]?.onSale && (
                            <div className="product-tag sale-tag">
                              Sale {item.salePercentage}%
                            </div>
                          )}
                        </a>
                        <h5>
                          <a href="#">{item.product.title}</a>
                        </h5>
                        <div className="product-price">
                        {/* <Money withoutTrailingZeros data={item.price.amount} /> */} 
                          <span className="s-price">${item.price.amount}</span>
                        </div>
                      </>
                    ))}
                  </div>
                ))}
              </div>
              <div className="pagination dfx flxcntr flxwrp">
                <span className="pager-prev">
                  <a href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10.031"
                      height="18.03"
                      viewBox="0 0 10.031 18.03"
                    >
                      <path
                        d="M893.239,2744.63l8.189,8.1a0.92,0.92,0,0,0,1.3,0,0.9,0.9,0,0,0,0-1.28l-7.54-7.46,7.539-7.46a0.907,0.907,0,0,0,0-1.29,0.92,0.92,0,0,0-1.3,0l-8.189,8.1A0.915,0.915,0,0,0,893.239,2744.63Z"
                        transform="translate(-892.969 -2734.97)"
                      />
                    </svg>
                  </a>
                </span>
                <span>
                  <a href="#">1</a>
                </span>
                <span className="active">
                  <a href="#">2</a>
                </span>
                <span>
                  <a href="#">3</a>
                </span>
                <span>
                  <a href="#">...</a>
                </span>
                <span>
                  <a href="#">5</a>
                </span>
                <span className="pager-next">
                  <a href="#">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10.03"
                      height="18"
                      viewBox="0 0 10.03 18"
                    >
                      <path
                        d="M1073.73,2743.36l-8.16-8.09a0.917,0.917,0,0,0-1.3,0,0.894,0.894,0,0,0,0,1.28l7.52,7.45-7.52,7.45a0.894,0.894,0,0,0,0,1.28,0.917,0.917,0,0,0,1.3,0l8.16-8.09A0.894,0.894,0,0,0,1073.73,2743.36Z"
                        transform="translate(-1064 -2735)"
                      />
                    </svg>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="image-i1-text im1t-xs dfx flxancntr p-60">
        <img src="img/feature-banner.jpg" />
        <div className="container">
          <h2 className="text-white text-up">Shop our Women collection</h2>
          <p className="text-white">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </p>
          <a href="#" className="btn btn-white">
            Shop now
          </a>
        </div>
      </div> */}
    </div>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
        }
      }
    }
    collections(first: 100) {
      edges {
        node {
          title
          handle
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

function getSortValuesFromParam(sortParam) {
  switch (sortParam) {
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      };
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      };
    case 'best-selling':
      return {
        sortKey: 'BEST_SELLING',
        reverse: false,
      };
    case 'newest':
      return {
        sortKey: 'CREATED',
        reverse: true,
      };
    case 'featured':
      return {
        sortKey: 'MANUAL',
        reverse: false,
      };
    default:
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      };
  }
}

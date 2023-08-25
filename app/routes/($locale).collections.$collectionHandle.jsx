import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {
  flattenConnection,
  AnalyticsPageType,
  Pagination,
  getPaginationVariables,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import {SortFilter, ProductCard, Link} from '~/components';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {getImageLoadingPriority} from '~/lib/const';
// import {feature} from '../img/feature-banner.jpg';

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
  console.log('collection', collection);
  return (
    <div className="collection-page">
      <div className="breadcrumb">
        <div className="container">
          <span>
            <a href="javascript:void(0)">Home</a>
          </span>
          <span>products</span>
        </div>
      </div>
      <div className="cllctn-page-in pb-60">
        <div className="container">
          <h2 className="page-title text-up text-center">{collection.title}</h2>

          <div className="row m-15">
            <SortFilter
              filters={collection.products.filters}
              appliedFilters={appliedFilters}
              collections={collections}
            />
            <Pagination connection={collection.products}>
              {({nodes, isLoading, PreviousLink, NextLink, pageInfo}) => (
                <div className="cllctn-list">
                  <div className="row m-15">
                    {nodes.map((product, i) => (
                      <div className="product-item">
                        <ProductCard
                          key={product.id}
                          loading={getImageLoadingPriority(i)}
                          product={product}
                        />
                      </div>
                    ))}
                  </div>
                  {nodes.length !== 0 ? (
                    <div className="pagination dfx flxcntr flxwrp">
                      {PreviousLink && (
                        <span className="pager-prev">
                          <Link to={PreviousLink}>
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
                          </Link>
                        </span>
                      )}
                      {Array.from({length: nodes.length}, (_, index) => (
                        <span key={index}>
                          <a href={`?page=${index + 1}`}>{index + 1}</a>
                        </span>
                      ))}
                      {NextLink && (
                        <span className="pager-next">
                          <Link to={NextLink}>
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
                          </Link>
                        </span>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </Pagination>
          </div>
        </div>
      </div>

      <div className="image-i1-text im1t-xs dfx flxancntr p-60">
        {/* <img src={feature} /> */}
        <div className="container">
          <h2 className="text-white text-up">Shop our Women collection</h2>
          <p className="text-white">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </p>
          <a href="javascript:void(0)" className="btn btn-white">
            Shop now
          </a>
        </div>
      </div>
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

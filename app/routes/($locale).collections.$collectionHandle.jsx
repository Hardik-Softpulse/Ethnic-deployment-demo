import {json} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import {
  flattenConnection,
  AnalyticsPageType,
  Pagination,
  getPaginationVariables,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import {SortFilter, ProductCard, FilterDrawer} from '~/components';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {getImageLoadingPriority} from '~/lib/const';
import colPageImg from '../img/women-coll.jpg';
import filterIcn from '../img/filter-icon-11.png';
import {useState} from 'react';
import {FILTER_URL_PREFIX} from '../components/SortFilter';

export const headers = routeHeaders;

export async function action({request, context}) {
  const {session, cart} = context;

  const [formData] = await Promise.all([request.formData()]);

  const {action, inputs} = CartForm.getFormInput(formData);
  invariant(action, 'No cartAction defined');

  let status = 200;
  let result;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;

    default:
      invariant(false, `${action} cart action is not defined`);
  }

  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart: cartResult, errors} = result;
  return json(
    {
      cart: cartResult,
      errors,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({params, request, context}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  const {collectionHandle} = params;

  invariant(collectionHandle, 'Missing collectionHandle param');

  const searchParams = new URL(request.url).searchParams;
  const {sortKey, reverse} = getSortValuesFromParam(searchParams.get('sort'));
  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        filters.push({
          [filterKey]: JSON.parse(value),
        });
      }
      return filters;
    },
    [],
  );

  const {collection, collections} = await context.storefront.query(
    COLLECTION_QUERY,
    {
      variables: {
        ...paginationVariables,
        handle: collectionHandle,
        filters,
        sortKey,
        reverse,
        language: context.storefront.i18n.language,
      },
    },
  );

  if (!collection) {
    throw new Response('collection', {status: 404});
  }

  const seo = seoPayload.collection({collection, url: request.url});

  const allFilterValues = collection.products.filters.flatMap(
    (filter) => filter.values,
  );

  const appliedFilters = filters
    .map((filter) => {
      const foundValue = allFilterValues.find((value) => {
        const valueInput = JSON.parse(value.input);
        if (valueInput.price && filter.price) {
          return true;
        }
        return JSON.stringify(valueInput) === JSON.stringify(filter);
      });
      if (!foundValue) {
        console.error('Could not find filter value for filter', filter);
        return null;
      }

      if (foundValue.id === 'filter.v.price') {
        const input = JSON.parse(foundValue.input);
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : '';
        const label = min && max ? `${min} - ${max}` : 'Price';
        return {
          filter,
          label,
        };
      }
      return {
        filter,
        label: foundValue.label,
      };
    })
    .filter((filter) => filter !== null);

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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const items = [
    {label: 'Featured', key: 'featured'},
    {
      label: 'Price: Low - High',
      key: 'price-low-high',
    },
    {
      label: 'Price: High - Low',
      key: 'price-high-low',
    },
    {
      label: 'Best Selling',
      key: 'best-selling',
    },
    {
      label: 'Newest',
      key: 'newest',
    },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const activeItem = items.find((item) => item.key === params.get('sort'));

  const handleSortChange = (event) => {
    const selectedSortOption = event.target.value;
    navigateToSort(selectedSortOption);
  };

  const navigateToSort = (selectedSortOption) => {
    const newUrl = getSortLink(selectedSortOption);
    navigate(newUrl);
  };

  const getSortLink = (sort) => {
    const params = new URLSearchParams(location.search);
    params.set('sort', sort);
    return `${location.pathname}?${params.toString()}`;
  };

  return (
    <div className="collection-page">
      <div className="breadcrumb">
        <div className="container">
          <span>
            <a href="/">Home</a>
          </span>
          <span>products</span>
        </div>
      </div>
      <div className="cllctn-page-in pb-60">
        <div className="container">
          <h2 className="page-title text-up text-center">{collection.title}</h2>
          <span className="filter_icon">
            <img
              src={filterIcn}
              alt="filter icon"
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            />
          </span>
          <div className="filter_sort">
            <h6 className="filter-label">
              <label htmlFor="SortBy">Sort by:</label>
            </h6>
            <div className="select">
              <select
                id="sortSelect"
                value={activeItem ? activeItem.key : ''}
                onChange={handleSortChange}
              >
                {items.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                focusable="false"
                className="icon icon-caret"
                viewBox="0 0 10 6"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </div>
          {filterDrawerOpen && (
            <FilterDrawer
              filters={collection.products.filters}
              appliedFilters={appliedFilters}
              collection={collection}
              filterDrawerOpen={filterDrawerOpen}
              setFilterDrawerOpen={setFilterDrawerOpen}
            />
          )}

          <div
            className={`drawer-overlay  ${filterDrawerOpen ? 'active' : ''}`}
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
          ></div>
          <div className="row m-15">
            <SortFilter
              filters={collection.products.filters}
              appliedFilters={appliedFilters}
              collections={collections}
            />

            <Pagination connection={collection.products}>
              {({nodes, isLoading, PreviousLink, NextLink}) => (
                <div className="cllctn-list">
                  <div className="row m-15">
                    {isLoading ? (
                      <span className="loader"></span>
                    ) : nodes.length > 0 ? (
                      nodes.map((product, i) => (
                        <ProductCard
                          key={product.id}
                          loading={getImageLoadingPriority(i)}
                          product={product}
                        />
                      ))
                    ) : (
                      <p className="text-center no_product">
                        There are no products in this collection.
                      </p>
                    )}
                  </div>
                  {!isLoading && (
                    <div className="pagination dfx flxcntr flxwrp">
                      <span className="pager-prev">
                        <PreviousLink>
                          <button className="btn">Previous</button>
                        </PreviousLink>
                      </span>
                      <span className="pager-next">
                        <NextLink>
                          <button className="btn">Load More</button>
                        </NextLink>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </Pagination>
          </div>
        </div>
      </div>

      <div className="image-i1-text im1t-xs dfx flxancntr p-60">
        <img src={colPageImg} />
        <div className="container">
          <h2 className="text-white text-up">Shop our Women collection</h2>
          <p className="text-white">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </p>
          <a href="/collections" className="btn btn-white btn-col">
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
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
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
          startCursor
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

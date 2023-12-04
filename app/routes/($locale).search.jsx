import {defer} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Pagination, getPaginationVariables} from '@shopify/hydrogen';
import {ProductCard} from '~/components';
import {PAGINATION_SIZE} from '~/lib/const';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {getFeaturedData} from './($locale).featured-products';

export async function loader({request, context: {storefront}}) {
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get('q');
  const variables = getPaginationVariables(request, {pageBy: 8});

  const {products} = await storefront.query(SEARCH_QUERY, {
    variables: {
      searchTerm,
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const shouldGetRecommendations = !searchTerm || products?.nodes?.length === 0;

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: 'search',
      title: 'Search',
      handle: 'search',
      descriptionHtml: 'Search results',
      description: 'Search results',
      seo: {
        title: 'Search',
        description: `Showing ${products.nodes.length} search results for "${searchTerm}"`,
      },
      metafields: [],
      products,
      updatedAt: new Date().toISOString(),
    },
  });

  return defer({
    seo,
    searchTerm,
    products,
    noResultRecommendations: shouldGetRecommendations
      ? getNoResultRecommendations(storefront)
      : Promise.resolve(null),
  });
}

export default function Search() {
  const {searchTerm, products, noResultRecommendations, seo} = useLoaderData();
  const noResults = products?.nodes?.length === 0;

  return (
    <div className="all-collection">
      <div className="container">
        <h2 className="page-title text-up text-center">{seo.title}</h2>
        {!searchTerm || noResults ? (
          <NoResults
            searchTerm={searchTerm}
            noResults={noResults}
            recommendations={noResultRecommendations}
          />
        ) : (
          <Pagination connection={products}>
            {({nodes, isLoading, PreviousLink, NextLink, pageInfo}) => (
              <>
                <div className="row m-15 ">
                  {nodes.map((product, i) => (
                    <ProductCard
                      className="all-collection-item"
                      key={product.id}
                      loading={getImageLoadingPriority(i)}
                      product={product}
                    />
                  ))}
                </div>

                <div className="pagination dfx flxcntr flxwrp">
                  <span className="pager-prev">
                    <PreviousLink>
                      <button>previous</button>
                    </PreviousLink>
                  </span>

                  {/* {Array.from({length: nodes.length}, (_, index) => (
                        <span key={index}>
                          <a href={`?page=${index + 1}`}>{index + 1}</a>
                        </span>
                      ))} */}

                  <span className="pager-next">
                    <NextLink>
                      <button className="btn">Load More</button>
                    </NextLink>
                  </span>
                </div>
              </>
            )}
          </Pagination>
        )}
      </div>
    </div>
  );
}

function NoResults({noResults, recommendations, searchTerm}) {
  return (
    <>
      <div className="mb-60 no_result text-center">
        <ul>
          <li>
            We are sorry! We couldn't find results for
            <span>{`"searched ${searchTerm}"`}</span>.
          </li>
          <li>
            But don't give up – check the spelling or try less specific search
            terms.
          </li>
        </ul>
      </div>
    </>
  );
}
export function getNoResultRecommendations(storefront) {
  return getFeaturedData(storefront, {pageBy: PAGINATION_SIZE});
}

const SEARCH_QUERY = `#graphql
  query PaginatedProductsSearch(
    $endCursor: String
    $first: Int
    $last: Int
    $searchTerm: String
    $startCursor: String
  ){
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: RELEVANCE,
      query: $searchTerm
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }

  ${PRODUCT_CARD_FRAGMENT}
`;

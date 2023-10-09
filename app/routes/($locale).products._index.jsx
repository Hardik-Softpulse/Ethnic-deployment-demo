import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {Pagination, getPaginationVariables} from '@shopify/hydrogen';
import {ProductCard, SortFilter} from '~/components';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

const PAGE_BY = 8;

export const headers = routeHeaders;

export async function loader({request, context: {storefront}}) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});

  const data = await storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: 'all-products',
      title: 'All Products',
      handle: 'products',
      descriptionHtml: 'All the store products',
      description: 'All the store products',
      seo: {
        title: 'All Products',
        description: 'All the store products',
      },
      metafields: [],
      products: data.products,
      updatedAt: '',
    },
  });

  return json({
    products: data.products,
    seo,
  });
}

export default function AllProducts() {
  const {products, seo} = useLoaderData();

  return (
    <div className="all-collection">
      <div className="cllctn-page-in pb-60">
        <div className="container">
          <h2 className="page-title text-up text-center">{seo.title}</h2>

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
                  <span className="pager-next">
                    <NextLink>
                      <button className="btn">Load More</button>
                    </NextLink>
                  </span>
                </div>
              </>
            )}
          </Pagination>
        </div>
      </div>
    </div>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
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
  ${PRODUCT_CARD_FRAGMENT}
`;

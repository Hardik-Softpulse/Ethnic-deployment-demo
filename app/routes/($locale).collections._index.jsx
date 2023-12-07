import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Image, Pagination, getPaginationVariables} from '@shopify/hydrogen';
import {Link} from '~/components';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

const PAGINATION_SIZE = 4;

export const headers = routeHeaders;

export const loader = async ({request, context: {storefront}}) => {
  const variables = getPaginationVariables(request, {pageBy: PAGINATION_SIZE});
  const {collections} = await storefront.query(COLLECTIONS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const seo = seoPayload.listCollections({
    collections,
    url: request.url,
  });

  return json({collections, seo});
};

export default function Collections() {
  const {collections, seo} = useLoaderData();

  console.log('collections', collections);

  return (
    <div className="all-collection">
      <div className="cllctn-page-in pb-60">
        <div className="container">
          <h2 className="page-title text-up text-center">{seo.title}</h2>
          <Pagination connection={collections}>
            {({nodes, isLoading, PreviousLink, NextLink}) => (
              <>
                <div className="row m-15 ">
                  {nodes.map((collection, i) => (
                    <CollectionCard
                      collection={collection}
                      key={collection.id}
                      loading={getImageLoadingPriority(i, 2)}
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

function CollectionCard({collection, loading}) {
  return (
    <div className="collection-item col all-collection-item">
      <Link
        className="collection-img"
        to={`/collections/${collection.handle}`}
        prefetch="intent"
      >
        {collection?.image && (
          <Image
            className="object-cover w-full fadeIn"
            data={collection.image}
            aspectRatio="6/4"
            sizes="(max-width: 32em) 100vw, 45vw"
            loading={loading}
          />
        )}
      </Link>
      <h5>{collection.title}</h5>
    </div>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        id
        title
        description
        handle
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
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

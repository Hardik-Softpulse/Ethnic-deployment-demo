import {getSelectedProductOptions} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';

import {
  PRODUCT_CARD_FRAGMENT,
  FEATURED_COLLECTION_FRAGMENT,
} from '~/data/fragments';

export async function loader({context: {storefront}}) {
  return json(await getFeaturedData(storefront));
}

export async function getFeaturedData(storefront, variables = {} ) {

  const data = await storefront.query(FEATURED_ITEMS_QUERY, {
    variables: {
      pageBy: 12,
      language: storefront.i18n.language,
      ...variables,
    },
  });

  invariant(data, 'No featured items data returned from Shopify API');

  return data;
}

export const FEATURED_ITEMS_QUERY = `#graphql
  query FeaturedItems(
    $language: LanguageCode
    $pageBy: Int = 12
  ) @inContext(language: $language) {
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
      nodes {
        ...FeaturedCollectionDetails
      }
    }
    featuredProducts: products(first: $pageBy) {
      nodes {
        ...ProductCard
      }
    }
  }


  ${FEATURED_COLLECTION_FRAGMENT}
`;

import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {ProductSwimlane, FeaturedCollections, Hero} from '~/components';
import {ShopCollection} from '~/components/ShopCollection';
import {Blogs} from '~/components/Blogs';
import {Banner} from '~/components/Banner';
import {BrandSection} from '~/components/BrandSection';
import {SaleOn} from '~/components/SaleOn';
import {NewArrival} from '~/components/NewArrival';
import {BestSeller} from '~/components/BestSeller';

export async function loader({params, context}) {
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are on `EN-US`
    // the the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  return defer({
    // These different queries are separated to illustrate how 3rd party content
    // fetching can be optimized for both above and below the fold.

    featuredCollections: context.storefront.query(FEATURED_COLLECTIONS_QUERY, {
      variables: {
        country,
        language,
      },
    }),

    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function HomePage() {
  const {
    primaryHero,
    secondaryHero,
    tertiaryHero,
    featuredCollections,
    featuredProducts,
  } = useLoaderData();
  return (
    <div>
      <Hero />
      {featuredCollections && (
        <Suspense>
          <Await resolve={featuredCollections}>
            {({collections}) => {
              if (!collections?.nodes) return <></>;
              return (
                <ShopCollection collections={collections} title="Collections" />
              );
            }}
          </Await>
        </Suspense>
      )}
      <BestSeller />
      <Banner />
      <NewArrival />
      <SaleOn />
      <Blogs />
      <BrandSection />
    </div>
  );
}
export const FEATURED_COLLECTIONS_QUERY = `#graphql
  query homepageFeaturedCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(
      first: 4,
      sortKey: UPDATED_AT
    ) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;

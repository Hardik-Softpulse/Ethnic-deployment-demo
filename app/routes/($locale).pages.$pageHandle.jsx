import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import Index from './($locale).api.contact-form';

export const headers = routeHeaders;

export async function loader({request, params, context}) {
  invariant(params.pageHandle, 'Missing page handle');


  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.pageHandle,
      language: context.storefront.i18n.language,
    },
  });

  if (!page) {
    throw new Response(null, {status: 404});
  }

  const seo = seoPayload.page({page, url: request.url});

  return json({page, seo});
}

export default function Page() {
  const {page, seo} = useLoaderData();

  if (page.id === 'gid://shopify/Page/30708353') {
    return page.body && <Index seo={seo.title}/>;
  }

  return (
    <div className="all-contain-page">
      <div className="container">
        <h2 className="page-title text-up text-center">{seo.title}</h2>
        <p
          dangerouslySetInnerHTML={{__html: page.body}}
          className="text-contain"
        />
      </div>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query PageDetails( $handle: String!){
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;

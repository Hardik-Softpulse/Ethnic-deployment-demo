import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {
  flattenConnection,
  getPaginationVariables,
  Image,
  Pagination,
} from '@shopify/hydrogen';
import {Link} from '~/components';
import {getImageLoadingPriority, PAGINATION_SIZE} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

const BLOG_HANDLE = 'news';

export const headers = routeHeaders;

export const loader = async ({request, context: {storefront}, params}) => {
  const {language, country} = storefront.i18n;

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const {blog} = await storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: BLOG_HANDLE,
      ...paginationVariables,
      language,
    },
  });

  if (!blog?.articles || !blog.articles.nodes) {
    throw new Response('Not found', {status: 404});
  }

  const articles = blog.articles.nodes.map((article) => {
    const {publishedAt} = article;
    return {
      ...article,
      publishedAt: new Intl.DateTimeFormat(`${language}-${country}`, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(publishedAt)),
    };
  });

  const title = blog.title;
  const pageInfo = blog.articles.pageInfo;
  const seo = seoPayload.blog({blog, url: request.url});

  return json({articles, seo, title, pageInfo});
};

export default function Journals() {
  const {articles, seo, title} = useLoaderData();
  console.log('articles', articles);

  return (
    <div className="blog-post-page clearfix">
      <div className="breadcrumb">
        <div className="container">
          <span>
            <a href="/">Home</a>
          </span>
          <span>{BLOG_HANDLE}</span>
        </div>
      </div>

      {articles?.length > 0 ? (
        <>
          <div className="container">
            <h2 className="page-title text-up text-center">{title}</h2>
            <div className="row m-15">
              {articles?.map((article, i) => (
                <div className="blog-post-item" key={i}>
                  <Link
                    to={`/${BLOG_HANDLE.toLowerCase()}/${article.handle}`}
                    className="blog-img"
                  >
                    {article.image && (
                      <Image
                        alt={article.image.altText || article.title}
                        data={article.image}
                        loading={getImageLoadingPriority(i, 2)}
                      />
                    )}
                  </Link>

                  <p className="blog-date">{article.publishedAt}</p>
                  <div className="blog-title">{article.title}</div>
                  <Link
                    to={`/${BLOG_HANDLE.toLowerCase()}/${article.handle}`}
                    className="shop-link"
                  >
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* <Pagination connection={articles}>
            {({PreviousLink, NextLink}) => (
              <div className="pagination dfx flxcntr flxwrp">
                <span className="pager-prev">
                  <PreviousLink>
                    {' '}
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
                  </PreviousLink>
                </span>
               
                <span className="pager-next">
                  <NextLink>
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
                  </NextLink>
                </span>
              </div>
            )}
          </Pagination> */}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export const BLOGS_QUERY = `#graphql
query Blog(
  $language: LanguageCode, 
  $blogHandle: String!, 
  $first: Int!, 
  $last: Int,
  $startCursor: String,
  $cursor: String) @inContext(language: $language) {
  blog(handle: $blogHandle) {
    title
    seo {
      title
      description
    }
    articles(
      first: $first, 
      after: $cursor ,
      last: $last,
      before: $startCursor
    ) {
      nodes {  
        ...Article
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
}

fragment Article on Article {
  author: authorV2 {
    name
  }
  contentHtml
  handle
  id
  image {
    id
    altText
    url
    width
    height
  }
  publishedAt
  title
}
`;

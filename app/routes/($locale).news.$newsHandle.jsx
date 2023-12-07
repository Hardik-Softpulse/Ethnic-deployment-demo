import {json} from '@shopify/remix-oxygen';
import { Link, useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import {getImageLoadingPriority} from '~/lib/const';

const BLOG_HANDLE = 'news';

export const headers = routeHeaders;

export async function loader({request, params, context}) {
  const {language, country} = context.storefront.i18n;

  invariant(params.newsHandle, 'Missing journal handle');

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const blogs = await context.storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: BLOG_HANDLE,
      ...paginationVariables,
      language,
    },
  });

  const allBlog = blogs.blog.articles;

  if (!blogs?.blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  const articles = allBlog.nodes.map((article) => {
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

  const seoblog = seoPayload.blog({blogs, url: request.url});

  /* -------  articale ----------*/

  const {blog} = await context.storefront.query(ARTICLE_QUERY, {
    variables: {
      blogHandle: BLOG_HANDLE,
      articleHandle: params.newsHandle,
      language,
    },
  });

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog.articleByHandle;

  const formattedDate = new Intl.DateTimeFormat(`${language}-${country}`, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article?.publishedAt));

  const seo = seoPayload.article({article, url: request.url});

  return json({article, formattedDate, seo, blog, seoblog, articles});
}

export default function Article() {
  const {article, formattedDate, seo, blog, seoblog, articles} =
    useLoaderData();
  const {title, image, contentHtml, author} = article;
  return (
    <div className="article-post-page clearfix">
      <div className="container">
        <div className="breadcrumb">
          <span>
            <Link to="/">Home </Link>
          </span>
          <span>
            <Link to="/news">Blogs </Link>
          </span>
          <span>{seo.title}</span>
        </div>
      </div>
      <div className="article-content">
        <div className="container">
          <div className="article-top text-center">
            <h2 className="page-title">{title}</h2>
            <p>{author.name}</p>
            <p>
              <time>{formattedDate}</time> &nbsp;|&nbsp; By softpulse infotech
            </p>
          </div>
          <div className="article-img">
            <Image data={image} className="article-image" />
          </div>
          <div className="article-rte">
            <p dangerouslySetInnerHTML={{__html: contentHtml}} />
          </div>
          <div className="social-icons dfx flxwrp">
            <span>
              <strong>Share:</strong>
            </span>
            <div className="sicon-list">
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"></path>
                </svg>
              </a>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"></path>
                </svg>
              </a>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.829 6.302c-.738-.034-.96-.04-2.829-.04s-2.09.007-2.828.04c-1.899.087-2.783.986-2.87 2.87-.033.738-.041.959-.041 2.828s.008 2.09.041 2.829c.087 1.879.967 2.783 2.87 2.87.737.033.959.041 2.828.041 1.87 0 2.091-.007 2.829-.041 1.899-.086 2.782-.988 2.87-2.87.033-.738.04-.96.04-2.829s-.007-2.09-.04-2.828c-.088-1.883-.973-2.783-2.87-2.87zm-2.829 9.293c-1.985 0-3.595-1.609-3.595-3.595 0-1.985 1.61-3.594 3.595-3.594s3.595 1.609 3.595 3.594c0 1.985-1.61 3.595-3.595 3.595zm3.737-6.491c-.464 0-.84-.376-.84-.84 0-.464.376-.84.84-.84.464 0 .84.376.84.84 0 .463-.376.84-.84.84zm-1.404 2.896c0 1.289-1.045 2.333-2.333 2.333s-2.333-1.044-2.333-2.333c0-1.289 1.045-2.333 2.333-2.333s2.333 1.044 2.333 2.333zm-2.333-12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.958 14.886c-.115 2.545-1.532 3.955-4.071 4.072-.747.034-.986.042-2.887.042s-2.139-.008-2.886-.042c-2.544-.117-3.955-1.529-4.072-4.072-.034-.746-.042-.985-.042-2.886 0-1.901.008-2.139.042-2.886.117-2.544 1.529-3.955 4.072-4.071.747-.035.985-.043 2.886-.043s2.14.008 2.887.043c2.545.117 3.957 1.532 4.071 4.071.034.747.042.985.042 2.886 0 1.901-.008 2.14-.042 2.886z"></path>
                </svg>
              </a>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="related-blogs">
        <div className="container">
          <div className="sctn-title text-center">
            <h2 className="h2 text-up">Related Blogs</h2>
          </div>
          <div className="row m-15">
            {articles?.map((article, i) => (
              <div className="blog-post-item col" key={i}>
                <Link
                  to={`/${BLOG_HANDLE}/${article.handle}`}
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
                <p className="blogtitle-subtext">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.{' '}
                </p>
                <Link to={`/${BLOG_HANDLE}`} className="shop-link">
                  Read More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ARTICLE_QUERY = `#graphql
  query ArticleDetails(
    $language: LanguageCode
    $blogHandle: String!
    $articleHandle: String!
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
`;

const BLOGS_QUERY = `#graphql
query Blog(
  $language: LanguageCode, 
  $blogHandle: String!, 
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
      first: 3, 
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

import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {getImageLoadingPriority} from '~/lib/const';
import {Swiper, SwiperSlide} from 'swiper/react';
import { useState } from 'react';

export function OurBlogs({blogHandle, articles, title}) {
  const [showSwiper, setShowSwiper] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSwiper(true);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <div className="blog-post-list mb-86">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h2 text-up">{title}</h2>
        </div>
        <div className="row m-15">
          {showSwiper && (
            <Swiper
              slidesPerView={1.3}
              // spaceBetween={10}
              breakpoints={{
                640: {
                  slidesPerView: 1.3,
                  // spaceBetween: 10,
                },
                768: {
                  slidesPerView: 2,
                  // spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  // spaceBetween: 25,
                },
              }}
              className="swiper-wrapper"
            >
              {articles?.map((article, i) => (
                <SwiperSlide>
                  <div className="blog-post-item col" key={i}>
                    <Link
                      to={`/${blogHandle}/${article.handle}`}
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <Link to={`/${blogHandle}`} className="shop-link">
                      Read More
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <div className="read-more-btn text-center">
          <Link to={`/${blogHandle}`} className="btn">
            Read All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}

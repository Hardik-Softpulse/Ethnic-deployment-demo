import React, {useEffect, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Link} from './Link';
import {Navigation} from 'swiper/modules';

export function ResentlyView({product}) {
  const [items, setItems] = useState([]);
  const [showSwiper, setShowSwiper] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSwiper(true);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  const productData = {
    productHandle: product[0].product.handle,
    productTitle: product[0].product.title,
    productImg: product[0].image?.url,
    productPrice: product[0].price,
    productUrl: product[0].id,
    compareAtPrice: product[0].compareAtPrice,
  };

  const resentProduct = () => {
    const info = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    setItems(info);

    if (info) {
      const isProductInList = info.some(
        (item) => item.productUrl === productData.productUrl,
      );

      if (!isProductInList) {
        const updatedItems = [productData, ...info.slice(0, 4)];
        setItems(updatedItems);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedItems));
      }
    }
  };

  useEffect(() => {
    resentProduct();
  }, [product]);

  return (
    <div className="collection-products">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h2 text-up">RECENTLY VIEWED PRODUCTS</h2>
        </div>
        <div className="product-slider">
          {showSwiper && (
            <Swiper
              spaceBetween={15}
              draggable={true}
              slidesPerView={1.3}
              modules={[Navigation]}
              navigation={true}
              breakpoints={{
                375:{
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 2.4,
                  spaceBetween: 15,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
            >
              {items?.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="product-item">
                    <Link
                      className="product-img"
                      to={`/products/${item.productHandle}`}
                    >
                      <Image
                        src={item.productImg}
                        alt={`Picture of ${item.productTitle}`}
                      />
                    </Link>

                    <h5>
                      <Link to={`/products/${item.productHandle}`}>
                        {item.productTitle}
                      </Link>
                    </h5>
                    <div className="product-price">
                      <span className="s-price">
                        <Money withoutTrailingZeros data={item?.productPrice} />
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}



<<<<<<< HEAD
import React, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import {SectionProductCard} from '~/components';

export function NewArrival({product, title}) {
  const [showSwiper, setShowSwiper] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSwiper(true);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

=======
import React, {useEffect} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import {SectionProductCard} from '~/components';

export function NewArrival({product, title}) {
>>>>>>> 8a46a988dab2d91ea773b47aeef71923ea0ae10d
  return (
    <div className="collection-products">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h2 text-up">{title}</h2>
        </div>
        <div className="product-slider">
<<<<<<< HEAD
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
              {product?.map((products) => (
                <SwiperSlide key={products.id}>
                  <SectionProductCard product={products} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
=======
          <Swiper
            spaceBetween={15}
            draggable={true}
            slidesPerView={1.3}
            modules={[Navigation]}
            navigation={true}
            breakpoints={{
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
            {product?.map((products) => (
              <SwiperSlide key={products.id}>
                <SectionProductCard product={products} />
              </SwiperSlide>
            ))}
          </Swiper>
          
>>>>>>> 8a46a988dab2d91ea773b47aeef71923ea0ae10d
        </div>
      </div>
    </div>
  );
}

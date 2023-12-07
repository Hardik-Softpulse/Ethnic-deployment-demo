import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SectionProductCard } from '~/components';

export function NewArrival({ product, title }) {
  // console.log('NewArrival',product)
  return (
    <div className="collection-products">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h2 text-up">{title}</h2>
        </div>
        <div className="product-slider swiper-container">
          <Swiper
            spaceBetween={15}
            slidesPerView={1.3}
            navigation={true}
            // modules={[Navigation]}
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
            className="swiper-wrapper"
          >
            {product?.map((products) => (
              <SwiperSlide key={products.id}>
                <SectionProductCard product={products} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-prev ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="16"
              viewBox="0 0 18 15"
              className="stroke-icon"
            >
              <path
                d="M18 7.52344L1.6542 7.52344"
                stroke="#000"
                strokeWidth="2"
                fill="none"
              ></path>
              <path
                d="M7.97656 14L1.49988 7.52345L7.97656 1.04691"
                stroke="#000"
                strokeWidth="2"
                fill="none"
              ></path>
            </svg>
          </div>
          <div className="swiper-button-next">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="16"
              viewBox="0 0 18 15"
              className="stroke-icon"
            >
              <path
                d="M0 7.47656L16.3458 7.47656"
                stroke="#000"
                strokeWidth="2"
                fill="none"
              ></path>
              <path
                d="M10.0234 1L16.5001 7.47655L10.0234 13.9531"
                stroke="#000"
                strokeWidth="2"
                fill="none"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

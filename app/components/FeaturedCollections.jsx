import {useEffect} from 'react';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.min.css';
import {SectionProductCard} from '~/components';

export function FeaturedCollections({title = 'SHOP NEW ARRIVALS', products, count = 4}) {
  useEffect(() => {
    Swiper.use([Navigation]);
    var productSlider = new Swiper('.product-slider', {
      slidesPerView: 'auto',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }, [products]);

  return (
    <div className="collection-products">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="text-up">{title}</h2>
          <p> Lorem Ipsum is simply dummy text typesetting industry.</p>
        </div>
        <div className="product-slider swiper-container">
          <div className="swiper-wrapper">
            {products.nodes.map((product) => (
              <SectionProductCard
                product={product}
                key={product.id}
                count={4}
              />
            ))}
          </div>
          <div className="swiper-button-prev">
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

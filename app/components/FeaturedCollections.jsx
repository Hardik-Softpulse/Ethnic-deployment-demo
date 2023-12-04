import {useEffect, useState} from 'react';
import {Navigation} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import {SectionProductCard} from '~/components';

<<<<<<< HEAD
export function FeaturedCollections({
  title = 'SHOP NEW ARRIVALS',
  products,
=======
export function FeaturedCollections({title = 'SHOP NEW ARRIVALS', products, count = 4}) {
>>>>>>> 8a46a988dab2d91ea773b47aeef71923ea0ae10d

}) {
  const [showSwiper, setShowSwiper] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSwiper(true);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <div className="collection-products">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h2 text-up">{title}</h2>
          <p> Lorem Ipsum is simply dummy text typesetting industry.</p>
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
              {products.nodes.map((product) => (
                <SwiperSlide key={product.id}>
                  <SectionProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}

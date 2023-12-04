import banner from '../img/banner2.jpg';
import home from '../img/home.png';
import {Pagination} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

export function Hero() {
  return (
    <div className="slideshow-slider mb-96">
      <Swiper
        pagination={{clickable: true}}
        modules={[Pagination]}
        draggable={true}
        className="carousel"
      >
        <SwiperSlide>
          <div className="slideshow-item dfx flxancntr">
            <img src={home} />
            <div className="container">
              <div className="slideshow-text">
                <h2 className="h1 text-up">
                  Shop our <br />
                  new arrivals
                </h2>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <a href="/collections/new-arrival" className="btn">
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slideshow-item dfx flxancntr">
            <img src={banner} />
            <div className="container">
              <div className="slideshow-text">
                <h2 className="h1 text-up">
                  Shop our <br />
                  new arrivals
                </h2>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <a href="/collections/new-arrival" className="btn">
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

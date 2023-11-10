import banner from '../img/banner2.jpg';
import home from '../img/home.png';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

export function Hero() {
  const responsive = {
    desktop: {
      breakpoint: {max: 3000, min: 1024},
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: {max: 1024, min: 464},
      items: 1,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: {max: 464, min: 0},
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  return (
    <div className="slideshow-slider mb-96">
      <Carousel
        swipeable={true}
        draggable={true}
        responsive={responsive}
        ssr={true}
        showDots={true}
        infinite={true}
        autoPlaySpeed={2500}
        removeArrowOnDeviceType={['tablet', 'mobile', 'desktop']}
        className="carousel"
        dotListClass="custom-dot-list-style"
      >
        <div className="slideshow-item dfx flxancntr">
          <img src={home} />
          <div className="container">
            <div className="slideshow-text">
              <h2 className="h1 text-up">
                Shop our <br />
                new arrivals
              </h2>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <a href="/collections/new-arrival" className="btn">
                Shop Now
              </a>
            </div>
          </div>
        </div>
        <div className="slideshow-item dfx flxancntr">
          <img src={banner} />
          <div className="container">
            <div className="slideshow-text">
              <h2 className="h1 text-up">
                Shop our <br />
                new arrivals
              </h2>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <a href="/collections/new-arrival" className="btn">
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
}

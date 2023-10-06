import adidas from '../img/adidas.svg';
import nike from '../img/nike.svg';
import converse from '../img/converse.svg';
import vans from '../img/vans.svg';
import sperry from '../img/sperry.svg';
import timberland from '../img/timberland.svg';
import crocs from '../img/crocs.svg';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

export function BrandSection() {
  const responsive = {
    desktop: {
      breakpoint: {max: 3000, min: 1024},
      items: 7,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: {max: 1024, min: 464},
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: {max: 464, min: 0},
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <div className="brands-section mb-80">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h2 text-up">Our Brands</h2>
        </div>
        <div>
          <div className="brands-slider swiper-container">
            <Carousel
              swipeable={true}
              draggable={true}
              showDots={false}
              responsive={responsive}
              ssr={true}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={1700}
              keyBoardControl={true}
              removeArrowOnDeviceType={['tablet', 'mobile', 'desktop']}
              className="carousel"
            >
              <div className="brands-item ">
                <img src={adidas} />
              </div>
              <div className="brands-item ">
                <img src={nike} />
              </div>
              <div className="brands-item ">
                <img src={converse} />
              </div>
              <div className="brands-item ">
                <img src={vans} />
              </div>
              <div className="brands-item ">
                <img src={sperry} />
              </div>
              <div className="brands-item ">
                <img src={timberland} />
              </div>
              <div className="brands-item ">
                <img src={crocs} />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

import banner from '../img/banner.jpg';

export function Hero() {
  return (
    <div>
      <div className="slideshow-slider mb-96">
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
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s
              </p>
              <a href="#" className="btn">
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import section3 from '../img/section3.jpg';
import right from '../img/right.jpg';
import left from '../img/left.jpg';
import {Link} from './Link';

export function Banner() {
  return (
    <div className="product-feature-sct">
      <div className="container">
        <div className="col-block">
          <div className="col-item">
            <img src={section3} />
          </div>
          <div className="col-item">
            <h2>Almost Ready Brand</h2>
            <div className="divider"></div>
            <p>
              Almost Ready Brand was created with you in mind. We sell a variety
              of premium, high quality products at an affordable price. We pride
              ourselves in carrying all styles and sizes to ensure we have the
              most inclusivisity here at our store.We hope our brand inspires
              you and so we wanted to give you the opportunity to give back to
              the community. $1 dollar from every purchase will be donated to a
              local charity.
            </p>
            <Link to="/collections" className="shop-link">
              View More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

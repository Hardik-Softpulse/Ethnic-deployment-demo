import React from 'react';
import climg5 from '../img/cl-img-5.jpg';
import climg6 from '../img/cl-img-6.jpg';
import climg7 from '../img/cl-img-7.jpg';

export function SaleOn() {
  return (
    <div className="collection-list-2 mb-86">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h1 text-up">Sale on</h2>
        </div>
        <div className="row m-15">
          <div className="cllctn-i2-item col">
            <a href="#" className="cllctn-i2-img">
              <img src={climg5} alt='' />
              <div className="cllctn-i2-txt">
                <h4 className="text-white text-up">
                  50% Off <br />
                  Men collection
                </h4>
                <span className="btn btn-white btn-sm">Shop Now</span>
              </div>
            </a>
          </div>
          <div className="cllctn-i2-item col">
            <a href="#" className="cllctn-i2-img">
              <img src={climg6} alt='' />
              <div className="cllctn-i2-txt">
                <h4 className="text-white text-up">
                  60% off <br />
                  Women collection
                </h4>
                <span className="btn btn-white btn-sm">Shop Now</span>
              </div>
            </a>
          </div>
          <div className="cllctn-i2-item col">
            <a href="#" className="cllctn-i2-img">
              <img src={climg7} alt='' />
              <div className="cllctn-i2-txt">
                <h4 className="text-white text-up">
                  45% Off <br />
                  kids collection
                </h4>
                <span className="btn btn-white btn-sm">Shop Now</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

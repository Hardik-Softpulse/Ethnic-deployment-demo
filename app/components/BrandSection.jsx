import React, {useEffect} from 'react';
import adidas from '../img/adidas.svg';
import nike from '../img/nike.svg';
import crocs from '../img/crocs.svg';
import timberland from '../img/timberland.svg';
import vans from '../img/vans.svg';
import sperry from '../img/sperry.svg';
import converse from '../img/converse.svg';

export function BrandSection() {
  return (
    <div className="brands-section mb-80">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h1 text-up">Our Brands</h2>
        </div>

        <div className="brands-slider">
          <div className="swiper-wrapper">
            <div className="brands-item">
              <img src={adidas} alt="" />
            </div>
            <div className="brands-item">
              <img src={nike} alt="" />
            </div>
            <div className="brands-item">
              <img src={converse} alt="" />
            </div>
            <div className="brands-item">
              <img src={vans} alt="" />
            </div>
            <div className="brands-item">
              <img src={sperry} alt="" />
            </div>
            <div className="brands-item">
              <img src={timberland} alt="" />
            </div>
            <div className="brands-item">
              <img src={crocs} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

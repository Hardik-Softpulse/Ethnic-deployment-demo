import React, {useEffect} from 'react';
import product1 from '../img/product-1.jpg';
import product2 from '../img/product-2.jpg';
import product3 from '../img/product-3.jpg';
import product4 from '../img/product-4.jpg';
import product5 from '../img/product-5.jpg';
import product6 from '../img/product-6.jpg';
import product7 from '../img/product-7.jpg';
import product8 from '../img/product-8.jpg';

export function BestSeller() {
  return (
    <div className="collection-products">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h1 text-up">Shop Best Seller</h2>
        </div>
        <div className="product-slider swiper-container">
          <div className="swiper-wrapper">
            <div className="swiper-slide product-item">
              <a href="#" className="product-img">
                <img src={product1} alt="" />
                <div className="product-tag sale-tag">Sale 25%</div>
              </a>
              <h5>
                <a href="#">Shopify theme NMD_R1 Shoes</a>
              </h5>
              <div className="product-price">
                <span className="s-price">$120</span>
                <span className="o-price">$140</span>
              </div>
            </div>
            <div className="swiper-slide product-item">
              <a href="#" className="product-img">
                <img src={product2} alt="" />
                <div className="product-tag">Best Seller</div>
              </a>
              <h5>
                <a href="#">Shopify theme NMD_R1 Shoes</a>
              </h5>
              <div className="product-price">
                <span className="s-price">$120</span>
              </div>
            </div>
            <div className="swiper-slide product-item">
              <a href="#" className="product-img">
                <img src={product3} alt="" />
                <div className="product-tag new-tag">New Arrival</div>
              </a>
              <h5>
                <a href="#">Shopify theme NMD_R1 Shoes</a>
              </h5>
              <div className="product-price">
                <span className="s-price">$120</span>
              </div>
            </div>
            <div className="swiper-slide product-item">
              <a href="#" className="product-img">
                <img src={product4} alt="" />
              </a>
              <h5>
                <a href="#">Shopify theme NMD_R1 Shoes</a>
              </h5>
              <div className="product-price">
                <span className="s-price">$120</span>
              </div>
            </div>
            <div className="swiper-slide product-item">
              <a href="#" className="product-img">
                <img src={product5} alt="" />
              </a>
              <h5>
                <a href="#">Shopify theme NMD_R1 Shoes</a>
              </h5>
              <div className="product-price">
                <span className="s-price">$120</span>
              </div>
            </div>
            <div className="swiper-slide product-item">
              <a href="#" className="product-img">
                <img src={product6} alt="" />
              </a>
              <h5>
                <a href="#">Shopify theme NMD_R1 Shoes</a>
              </h5>
              <div className="product-price">
                <span className="s-price">$120</span>
              </div>
            </div>
            <div className="swiper-slide product-item">
              <a href="#" className="product-img">
                <img src={product7} alt="" />
              </a>
              <h5>
                <a href="#">Shopify theme NMD_R1 Shoes</a>
              </h5>
              <div className="product-price">
                <span className="s-price">$120</span>
              </div>
            </div>
            <div className="swiper-slide product-item">
              <a href="#" className="product-img">
                <img src={product8} alt="" />
              </a>
              <h5>
                <a href="#">Shopify theme NMD_R1 Shoes</a>
              </h5>
              <div className="product-price">
                <span className="s-price">$120</span>
              </div>
            </div>
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

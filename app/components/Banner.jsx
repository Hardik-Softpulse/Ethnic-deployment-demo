import React from 'react';
import featureBanner from '../img/feature-banner.jpg';

export function Banner() {
  return (
    <div className="image-i1-text dfx flxancntr p-90 mb-86">
      <img src={featureBanner} />
      <div className="container">
        <h2 className="text-white text-up">Shop our Women collection</h2>
        <p className="text-white">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s
        </p>
        <a href="/product" className="btn btn-white">
          Shop now
        </a>
      </div>
      
    </div>
  );
}


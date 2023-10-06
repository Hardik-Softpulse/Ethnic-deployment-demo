import React from 'react';
import {Link} from './Link';

export function SubBanner() {
  return (
    <div className="sub-banner">
      <div className="col-item">
        <h2>Style Finder</h2>
        <p>Looking for something specific? Let's get you there.</p>
        <Link to={`/collections`} className="btn btn-sm">
          Shop Now
        </Link>
      </div>
    </div>
  );
}

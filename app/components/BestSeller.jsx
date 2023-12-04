import clsx from 'clsx';
import {useEffect, useId, useMemo} from 'react';
import {useFetcher} from '@remix-run/react';
import {usePrefixPathWithLocale} from '~/lib/utils';
import {ProductCard} from '.';

export function BestSeller({
  count = 4,
  heading = 'Shop Best Seller',
  query,
  reverse,
  sortKey = 'BEST_SELLING',
}) {
  const {load, data} = useFetcher();

  const queryString = useMemo(
    () =>
      Object.entries({count, sortKey, query, reverse})
        .map(([key, val]) => (val ? `${key}=${val}` : null))
        .filter(Boolean)
        .join('&'),
    [count, sortKey, query, reverse],
  );
  const productsApiPath = usePrefixPathWithLocale(
    `/api/products?${queryString}`,
  );

  useEffect(() => {
    load(productsApiPath);
  }, [load, productsApiPath]);

  return (
    <div className="feature-products you-may-likes">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h2 text-up">{heading}</h2>
        </div>
        <div className="row">
          <FeatureProductsContent products={data?.products} count={count} />
        </div>
      </div>
    </div>
  );
}

function FeatureProductsContent({count, products}) {
  const id = useId();

  if (!products) {
    return (
      <>
        {[...new Array(count)].map((_, i) => (
          <div key={`${id + i}`} className="grid gap-2"></div>
        ))}
      </>
    );
  }

  if (products?.length === 0) {
    return <h3 format>No products found.</h3>;
  }
  return (
    <>
      {products?.map((product) => (
        <ProductCard product={product} key={product.id} quickAdd />
      ))}
    </>
  );
}

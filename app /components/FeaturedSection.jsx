import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

import {usePrefixPathWithLocale} from '~/lib/utils';
import {FeaturedCollections, BestSeller} from '~/components';

export function FeaturedSection() {
  const {load, data} = useFetcher();
  const path = usePrefixPathWithLocale('/featured-products');

  useEffect(() => {
    load(path);
  }, [load, path]);

  if (!data) return null;

  const {featuredCollections, featuredProducts} = data;

  return (
    <div className='featured-section'>
      {featuredCollections.nodes.length < 2 && (
        <BestSeller
          title="Popular Collections"
          collections={featuredCollections}
        />
      )}
      <FeaturedCollections products={featuredProducts} />
    </div>
  );
}

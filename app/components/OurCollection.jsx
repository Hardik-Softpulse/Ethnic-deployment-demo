import {Link} from './Link';
import {Image} from '@shopify/hydrogen';
// import cat2 from '../img/cat-2.jpg';
import cat2 from '../img/banner2.jpg';

export function OurCollection({collections, title = 'Our Category'}) {
 
  const desiredCollectionHandles = ['bags', 'women', 'shoes', 'accessories'];

  return (
    <div className="collection-list mb-96">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h2 text-up">{title}</h2>
        </div>
        <div className="row m-15">
          {collections?.map((collection) => {
            if (desiredCollectionHandles.includes(collection.handle)) {
              return (
                <div className="collection-item col" key={collection.id}>
                  <Link
                    to={`/collections/${collection.handle}`}
                    className="collection-img"
                  >
                    {collection?.image ? (
                      <Image
                        alt={`Image of ${collection.title}`}
                        data={collection.image}
                        aspectRatio="3/2"
                      />
                    ) : (
                      <img
                        src={cat2}
                        alt={`Default Image for ${collection.title}`}
                        className="default-image"
                      />
                    )}
                  </Link>
                  <h4>{collection.title}</h4>
                  <Link
                    key={collection.id}
                    to={`/collections/${collection.handle}`}
                    className="shop-link"
                  >
                    Shop Now
                  </Link>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

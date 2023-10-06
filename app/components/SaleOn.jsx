import {Link} from './Link';
import {Image} from '@shopify/hydrogen';

export function SaleOn({collections, title = 'Sale On', ...props}) {
  const haveCollections = collections?.nodes?.length > 0;
  if (!haveCollections) return null;

  const collectionsWithImage = collections.nodes.filter((item) => item.image);

  return (
    <div className="collection-list-2 mb-86">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h1 text-up">Sale on</h2>
        </div>
        <div className="row m-15">
          {collectionsWithImage.map((collection) => {
            return (
              <div className="cllctn-i2-item col" key={collection.id}>
                <Link
                  to={`/collections/${collection.handle}`}
                  className="cllctn-i2-img"
                >
                  {collection?.image && (
                    <Image
                      alt={`Image of ${collection.title}`}
                      data={collection.image}
                    />
                  )}
                  <div className="cllctn-i2-txt">
                    <h4 className="text-white text-up">
                      {/* 50% Off <br /> */}
                      {collection.title}
                    </h4>
                    <span className="btn btn-white btn-sm">Shop Now</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

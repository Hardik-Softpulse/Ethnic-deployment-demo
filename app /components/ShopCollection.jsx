export function ShopCollection({collections, title = 'Collections', ...props}) {
  const haveCollections = collections?.nodes?.length > 0;
  if (!haveCollections) return null;

  const collectionsWithImage = collections.nodes.filter((item) => item.image);

  return (
    <div className="collection-list mb-96">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h1 text-up">Shop our collection</h2>
        </div>
        <div className="row m-15">
          {collectionsWithImage.map((collection) => {
            return (
              <div className="collection-item col" key={collection.id}>
                <a
                  href={`/collections/${collection.handle}`}
                  className="collection-img"
                >
                  <img src={collection.image.url} />
                </a>
                <h4></h4>
                <a
                  href={`/collections/${collection.handle}`}
                  className="btn btn-sm"
                >
                  {collection.title}
                </a>
              </div>
            );
          })}

          {/* <div className="collection-item col">
            <a href="javascript:void(0)" className="collection-img">
              <img src={climg2} />
            </a>
            <h4>Women collection</h4>
            <a href="javascript:void(0)" className="btn btn-sm">
              Shop Now
            </a>
          </div>
          <div className="collection-item col">
            <a href="javascript:void(0)" className="collection-img">
              <img src={climg3} />
            </a>
            <h4>New Arrivals</h4>
            <a href="javascript:void(0)" className="btn btn-sm">
              Shop Now
            </a>
          </div>
          <div className="collection-item col">
            <a href="javascript:void(0)" className="collection-img">
              <img src={climg4} />
            </a>
            <h4>Best Seller</h4>
            <a href="javascript:void(0)" className="btn btn-sm">
              Shop Now
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}

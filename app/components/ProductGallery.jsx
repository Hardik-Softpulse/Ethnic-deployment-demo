export function ProductGallery({media}) {
  if (!media.length) {
    return null;
  }

  return (
    <div className="swiper-wrapper">
      {media.map((med) => (
        <div className="swiper-slide product-i1slide" key={med.id}>
          <div className="slide-product-img">
            <img src={med.image.url} />
          </div>
        </div>
      ))}
    </div>
  );
}

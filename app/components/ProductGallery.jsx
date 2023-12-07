export function ProductGallery({media}) {
  if (!media.length) {
    return null;
  }

  return (
    <div className="swiper-wrapper">
      {media.map((med) => (
        <div className="swiper-slide product-i1slide" key={med.id}>
          <a href="#" className="slide-product-img">
            <img src={med.image.url} />
          </a>
        </div>
      ))}
    </div>
  );
}

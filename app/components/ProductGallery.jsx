export function ProductGallery({media}) {
  if (!media.length) {
    return null;
  }

  return (
    <div className="swiper-wrapper">
      {media.map((med) => (
        <div className="swiper-slide product-i1slide" key={med.id}>
          <img src={med.image.url} />
        </div>
      ))}
    </div>
  );
}

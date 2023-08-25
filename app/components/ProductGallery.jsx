import {Image} from '@shopify/hydrogen';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({media}) {
  if (!media.length) {
    return null;
  }

  return (
    <div className="swiper-wrapper">
      {media.map((med, i) => {
        // const image =
        //   med.__typename === 'MediaImage'
        //     ? {...med.image, altText: med.alt || 'Product image'}
        //     : null;

        return (
          <div className="swiper-slide product-i1slide" key={med.id}>
            <Image data={med.image} />
          </div>
        );
      })}
    </div>
  );
}

import blogImg1 from '../img/blog-image-1.jpg';
import blogImg2 from '../img/blog-image-2.jpg';
import blogImg3 from '../img/blog-image-3.jpg';

export function Blogs() {
  return (
    <div className="blog-post-list mb-86">
      <div className="container">
        <div className="sctn-title text-center">
          <h2 className="h1 text-up">Our blogs</h2>
        </div>
        <div className="row m-15">
          <div className="blog-post-item col">
            <a href="#" className="blog-img">
              <img src={blogImg1} alt='' />
            </a>
            <h4 className="text-up">Shopify Theme blog</h4>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </p>
          </div>
          <div className="blog-post-item col">
            <a href="#" className="blog-img">
              <img src={blogImg2} alt='' />
            </a>
            <h4 className="text-up">Shopify Theme blog</h4>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </p>
          </div>
          <div className="blog-post-item col">
            <a href="#" className="blog-img">
              <img src={blogImg3} alt='' />
            </a>
            <h4 className="text-up">Shopify Theme blog</h4>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </p>
          </div>
        </div>
        <div className="read-more-btn text-center">
          <a href="/" className="btn">
            Read All Blogs
          </a>
        </div>
      </div>
    </div>
  );
}
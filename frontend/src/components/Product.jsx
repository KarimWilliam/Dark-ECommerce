import React from "react";
import Rating from "./Rating";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useState } from "react";

function Product({ product }) {
  const [imgCSS, setImgCSS] = useState(
    "card-img-top placeholder placeholder-glow"
  );
  const [imgStyle, setImgStyle] = useState("300px");
  return (
    <div
      className=" box-shadow-2 card h-100"
      style={{
        width: "300px",
        margin: "auto",
        borderColor: "rgba(33, 82, 107, 1)",
        borderWidth: " 0px 0px 0px 0px",
        borderRadius: 0,
      }}>
      <Link
        onClick={() =>
          sessionStorage.setItem("scrollPosition", window.pageYOffset)
        }
        to={`/product/${product._id}`}>
        <div className="placeholder-glow" style={{ padding: "10px" }}>
          <LazyLoadImage
            height="300px"
            width="300px"
            alt={product.name}
            style={{ height: imgStyle, padding: "0px" }}
            src={product.image}
            variant="top"
            afterLoad={() => {
              setImgCSS("card-img-top");
              setImgStyle("auto");
            }}
            className={imgCSS}
          />
        </div>
      </Link>
      <div className="card-body d-flex flex-column ">
        <Link style={{ textDecoration: "none" }} to={`/product/${product._id}`}>
          <div className="card-title">
            <strong>{product.name}</strong>
          </div>
        </Link>

        <div className="card-text mt-3">
          <Rating
            value={product.rating}
            text={`(${product.numReviews}) ${
              product.numReviews !== 1 ? "reviews" : "review"
            }`}
          />
        </div>
        <h3 style={{ justifyContent: "end" }} className="card-text d-flex ">
          ${product.price}
        </h3>
      </div>
    </div>
  );
}
Rating.defaultProps = {
  color: "#f8e825",
};
export default Product;

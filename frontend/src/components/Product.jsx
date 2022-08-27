import React from "react";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";

function Product({ product }) {
  return (
    <Card className="my-3 p-3 rounded ">
      <Link
        onClick={() =>
          sessionStorage.setItem("scrollPosition", window.pageYOffset)
        }
        to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`(${product.numReviews}) ${
              product.numReviews != 1 ? "reviews" : "review"
            }`}
          />
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
}
Rating.defaultProps = {
  color: "#f8e825",
};
export default Product;

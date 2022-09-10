import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import {
  getTopProducts,
  topProductsReset,
} from "../features/products/productSlice";

const ProductCarousel = () => {
  const dispatch = useDispatch();

  const productTopRated = useSelector((state) => state.product);
  const {
    topProductsLoading: loading,
    topProductsError: error,
    topProducts: products,
    topProductsMessage,
  } = productTopRated;

  useEffect(() => {
    dispatch(getTopProducts());
    dispatch(topProductsReset());
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{topProductsMessage}</Message>
  ) : (
    <div
      id="MainCarousel"
      className="carousel slide carousel-dark "
      data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button
          type="button"
          data-bs-target="#MainCarousel"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"></button>
        <button
          type="button"
          data-bs-target="#MainCarousel"
          data-bs-slide-to="1"
          aria-label="Slide 2"></button>
        <button
          type="button"
          data-bs-target="#MainCarousel"
          data-bs-slide-to="2"
          aria-label="Slide 3"></button>
        <button
          type="button"
          data-bs-target="#MainCarousel"
          data-bs-slide-to="3"
          aria-label="Slide 4"></button>
        <button
          type="button"
          data-bs-target="#MainCarousel"
          data-bs-slide-to="4"
          aria-label="Slide 5"></button>
      </div>
      <div style={{ "min-height": 520 }} className="carousel-inner">
        {products[0] && (
          <div className="carousel-item active" data-bs-interval="7000">
            <Link to={`/product/${products[0]._id}`}>
              <div className="carousel-caption d-none d-md-block">
                <h5>
                  {products[0].name} (${products[0].price})
                </h5>
              </div>
              <img
                src={products[0].image}
                className="d-block"
                alt={products[0].name}
              />
            </Link>
          </div>
        )}

        {products.slice(1).map((product) => (
          <div
            key={product._id}
            className="carousel-item "
            data-bs-interval="7000">
            <Link to={`/product/${product._id}`}>
              <div className="carousel-caption d-none d-md-block">
                <h5>
                  {product.name} (${product.price})
                </h5>
              </div>

              <img
                src={product.image}
                alt={product.name}
                className="d-block "
              />
            </Link>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev   "
        type="button"
        data-bs-target="#MainCarousel"
        data-bs-slide="prev">
        <span
          className="carousel-control-prev-icon  d-none d-md-block"
          aria-hidden="false"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next "
        type="button"
        data-bs-target="#MainCarousel"
        data-bs-slide="next">
        <span
          className="carousel-control-next-icon d-none d-md-block  "
          aria-hidden="false"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default ProductCarousel;

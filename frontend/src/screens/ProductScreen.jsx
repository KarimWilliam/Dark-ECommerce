import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Rating from "../components/Rating";
import { useSelector, useDispatch } from "react-redux";
import Meta from "../components/Meta";
import {
  getProduct,
  createProductReview,
  createProductReset,
  createReviewReset,
} from "../features/products/productSlice";
import Message from "../components/Message";
import {
  addToLoggedCart,
  reset,
  getItems,
  addItem,
} from "../features/cart/cartSlice";

function ProductScreen() {
  const { user } = useSelector((state) => state.auth);
  const { addToLoggedCartSuccess, addToLoggedCartLoading } = useSelector(
    (state) => state.cart
  );
  const { id } = useParams(); //get id from the paramaters of the url
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    product,
    message,
    isLoading,
    isError,
    createReviewLoading,
    createReviewSuccess,
    createReviewError,
    createReviewMessage,
  } = useSelector((state) => state.product);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sucMsg, setsucMsg] = useState("");
  const [productReviews, setProductReviews] = useState([]);
  useEffect(() => {
    if (addToLoggedCartSuccess) {
      setsucMsg(<Message variant={"success"}>Item added to cart</Message>);
      dispatch(reset());
      dispatch(getItems());
    }
  }, [addToLoggedCartSuccess, dispatch]);
  useEffect(() => {
    dispatch(createReviewReset());
    if (createReviewSuccess) {
      setRating(0);
      setComment("");
      dispatch(getProduct(id));
      dispatch(createProductReset());
      dispatch(createReviewReset());
    }
    if (!product._id || product._id !== id) {
      dispatch(getProduct(id));
      dispatch(createProductReset());
    }
    if (product.reviews) {
      setProductReviews(product.reviews);
    }
  }, [dispatch, createReviewSuccess, id, product]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const addToCartHandlerLater = () => {
    if (user) {
      dispatch(addToLoggedCart({ id, qty }));
    } else {
      dispatch(addItem({ id, qty }));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview({ id: id, review: { rating, comment } }));
  };

  return (
    <>
      {sucMsg}

      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {isError ? (
        <Message variant="danger">{message}</Message>
      ) : isLoading ? (
        <Loader />
      ) : (
        <>
          <Meta title={product.name} />
          <div title={product.name} />
          <div className="row">
            <div
              className="col-md-3 col"
              style={{ minWidth: "320px", paddingBottom: "20px" }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ maxWidth: "100%" }}
              />
            </div>
            <div
              className="col-md-6 col description-container "
              style={{ textAlign: "justify" }}>
              <ul className="list-group list-group-flush ">
                <li className="list-group-item ">
                  <h3>{product.name}</h3>
                </li>
                <li className="list-group-item">
                  <Rating
                    value={product.rating}
                    text={`(${product.numReviews}) ${
                      product.numReviews !== 1 ? "reviews" : "review"
                    }`}
                  />
                </li>
                <li className="list-group-item">Price: ${product.price}</li>
                <li className="list-group-item">
                  Description: {product.description}
                </li>
              </ul>
            </div>
            <div
              className="col col-md-3"
              style={{
                minWidth: "320px",
                marginLeft: "auto",
                paddingBottom: "30px",
              }}>
              <div className="card ">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col">Price:</div>
                      <div className="col">
                        <strong>${product.price}</strong>
                      </div>
                    </div>
                  </li>

                  <li className="list-group-item ">
                    <div className="row">
                      <div className="col">Status:</div>
                      <div className="col">
                        {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                      </div>
                    </div>
                  </li>

                  {product.countInStock > 0 && (
                    <li className="list-group-item">
                      <div className="row">
                        <div className="col">Qty</div>
                        <div className="col">
                          <select
                            className="form-select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}>
                            {product.countInStock <= 30
                              ? [...Array(product.countInStock).keys()].map(
                                  (x) => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                  )
                                )
                              : [...Array(30).keys()].map((x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                ))}
                          </select>
                        </div>
                      </div>
                    </li>
                  )}
                  {addToLoggedCartLoading ? (
                    <div
                      className="spinner-border"
                      style={{
                        margin: "auto",
                        display: "block",
                      }}
                      role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <ul className="list-group-item d-flex flex-nowrap">
                      <button
                        onClick={addToCartHandler}
                        style={{
                          textTransform: "capitalize",
                        }}
                        className=" btn  secondary-color "
                        // style={{ minWidth: "100px", height: "50px" }}
                        type="button"
                        disabled={
                          product.countInStock === 0 ||
                          product.visibility === false
                        }>
                        Buy Now
                      </button>
                      <button
                        onClick={addToCartHandlerLater}
                        className="btn btn-dark main-color "
                        type="button"
                        style={{
                          textTransform: "capitalize",
                          marginLeft: "auto",
                        }}
                        disabled={
                          product.countInStock === 0 ||
                          product.visibility === false
                        }>
                        Add To Cart
                      </button>
                    </ul>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col col-md-6">
              <h2>Reviews</h2>
              {productReviews.length === 0 && <Message>No Reviews</Message>}
              <ul className="list-group review-container list-group-flush">
                {productReviews.map((review) => (
                  <li className="list-group-item" key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p style={{ textAlign: "justify" }}>{review.comment}</p>
                  </li>
                ))}
                <li className="list-group-item">
                  <h2>Write a Review</h2>
                  {createReviewSuccess && (
                    <Message variant="success">
                      Review submitted successfully
                    </Message>
                  )}
                  {createReviewLoading && <Loader />}
                  {createReviewError && (
                    <Message variant="danger">{createReviewMessage}</Message>
                  )}
                  {user ? (
                    <form onSubmit={submitHandler}>
                      <div className="form-control" id="rating">
                        <div>Rating</div>
                        <select
                          className="form-select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}>
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </select>
                      </div>
                      <div id="comment">
                        <section>Comment</section>
                        <textarea
                          className="form-control"
                          value={comment}
                          onChange={(e) =>
                            setComment(e.target.value)
                          }></textarea>
                      </div>
                      <button
                        style={{
                          textTransform: "capitalize",
                        }}
                        className="btn main-color btn-dark"
                        disabled={createReviewLoading}
                        type="submit"
                        variant="primary">
                        Submit
                      </button>
                    </form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductScreen;

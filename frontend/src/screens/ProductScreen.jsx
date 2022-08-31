import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
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
import { addToLoggedCart, reset, getItems } from "../features/cart/cartSlice";

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
  }, [addToLoggedCartSuccess]);
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

  // useEffect(() => {
  //   dispatch(getProduct(id));
  // }, [dispatch, id]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const addToCartHandlerLater = () => {
    dispatch(addToLoggedCart({ id, qty }));
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
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
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
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      type="button"
                      disabled={
                        product.countInStock === 0 ||
                        product.visibility === false
                      }>
                      Buy Now
                    </Button>
                    <Button
                      onClick={addToCartHandlerLater}
                      className="btn-block"
                      type="button"
                      disabled={
                        product.countInStock === 0 ||
                        product.visibility === false
                      }>
                      {addToLoggedCartLoading ? <Loader /> : "Add To Cart"}
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {productReviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {productReviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
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
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}>
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) =>
                            setComment(e.target.value)
                          }></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={createReviewLoading}
                        type="submit"
                        variant="primary">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default ProductScreen;

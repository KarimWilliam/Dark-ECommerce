import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  editItem,
  removeItem,
  addToLoggedCart,
  getItems,
  reset,
  deleteItem,
} from "../features/cart/cartSlice";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";

function CartScreen() {
  const { defaultAddress, currentAddress } = useSelector(
    (state) => state.shipping
  );
  const { id } = useParams(); //get id from the paramaters of the url
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let qty = Number(searchParams.get("qty"));
  if (!qty) {
    qty = Number(1);
  }

  const {
    deleteSuccess,
    cartItems,
    isSuccess,
    isLoading,
    addToLoggedCartSuccess,
    addToLoggedCartLoading,
  } = useSelector((state) => state.cart);

  const { cartSteal } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  const prevRoute = useLocation();
  useEffect(() => {
    if (addToLoggedCartSuccess) {
      dispatch(getItems());
      dispatch(reset());
    }
  }, [dispatch, addToLoggedCartSuccess, deleteSuccess]);

  useEffect(() => {
    if (id) {
      dispatch(addToLoggedCart({ id, qty }));
      navigate("/cart");
      // dispatch(getItems());  DID THIS SO LOADING IS CONSISTANT REVERT IF THINGS BREAK
    }
  }, [dispatch, qty, id, navigate]);

  const removeFromCartHandler = (id) => {
    dispatch(removeItem(id));
    dispatch(deleteItem(id));
  };

  const checkoutHandler = () => {
    if (user) {
      console.log(currentAddress);
      if (!currentAddress) {
        navigate("/shipping", { state: { prevRoute } });
      } else if (!Object.keys(currentAddress).length > 0 || !currentAddress) {
        // navigate("/shipping");
        console.log(Object.keys(currentAddress).length);
        navigate("/shipping", { state: { prevRoute } });
      } else {
        navigate("/placeorder");
      }
    } else {
      navigate("/login");
    }
  };

  const handleOnChange = (item, e) => {
    let id = item.product._id;
    let qty = Number(e.target.value);
    let z = { id, qty };
    dispatch(addToLoggedCart(z));
  };

  return (
    <>
      {cartSteal &&
        cartSteal.map((item) => (
          <Message>
            {" "}
            {item.name} was removed from your cart because we didnt have enough
            supply{" "}
          </Message>
        ))}
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to="/">Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product._id}>
                  <Row>
                    <Col md={2}>
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product._id}`}>
                        {item.product.name}
                      </Link>
                    </Col>
                    <Col md={2}>${item.product.price}</Col>
                    <Col md={2}>
                      <select
                        onChange={(e) => handleOnChange(item, e)}
                        value={item.qty}
                        aria-label="Default select example">
                        {[...Array(item.product.countInStock).keys()].map(
                          (x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          )
                        )}
                      </select>
                    </Col>
                    <Col md={2}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item.product._id)}>
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  Subtotal (
                  {cartItems.reduce((acc, item) => acc + Number(item.qty), 0)})
                  items
                </h2>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.product.price, 0)
                  .toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}>
                  Proceed To Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      {(isLoading || addToLoggedCartLoading) && <Loader />}
    </>
  );
}

export default CartScreen;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";
import {
  getOrderDetails,
  payOrder,
  orderPayReset,
  deliverOrder,
  orderDeliverReset,
} from "../features/order/orderSlice";
import { stripePay } from "../features/stripe/stripeSlice";

const OrderScreen = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); //get id from the paramaters of the url

  const userLogin = useSelector((state) => state.auth);
  const { user: userInfo } = userLogin;

  const { StripeURL } = useSelector((state) => state.stripe);

  const orderDetails = useSelector((state) => state.order);
  const {
    order,
    isError,
    message,
    isLoading,
    isSuccess,
    createOrderError,
    createOrderLoading,
    createOrderSuccess,
    createOrderMessage,
    orderpayLoading: loadingPay,
    orderPaySuccess: successPay,
    orderDeliverSuccess,
    orderDeliverLoading,
  } = orderDetails;
  let itemPrice = 0;

  useEffect(() => {
    if (!order || order._id !== id || orderDeliverSuccess) {
      dispatch(orderPayReset());
      dispatch(payOrder(id));
      dispatch(getOrderDetails(id));
      dispatch(orderDeliverReset());
    }
  }, [dispatch, order, id, successPay, orderDeliverSuccess]);

  //   Calculate prices

  if (isSuccess) {
    console.log(isSuccess);
    console.log(order);
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    itemPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(id));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(id));
  };

  //////////////////////////////   STRIPE PAYMENT ////////////////////////////////////

  const onPayClick = () => {
    dispatch(stripePay(order._id));
  };

  useEffect(() => {
    if (StripeURL) {
      window.location = StripeURL;
    }
  }, [StripeURL]);

  useEffect(() => {
    dispatch(payOrder(id));
    dispatch(getOrderDetails(id));
  }, [id, dispatch]);

  /////////////////////////////////////    VISUAL    ////////////////////////////////////////////////////////////

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger">{message}</Message>
  ) : isSuccess ? (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {userInfo.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="info">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="info">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${itemPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  <Button onClick={onPayClick}>Pay</Button>
                </ListGroup.Item>
              )}
              {/* {orderDeliverLoading && <Loader />} */}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}>
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  ) : (
    <></>
  );
};

export default OrderScreen;

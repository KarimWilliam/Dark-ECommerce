import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
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
  paymentComplete,
  paymentCompleteReset,
  finalizeOrder,
  finalizeReset,
} from "../features/order/orderSlice";
import { clearCart, getItems } from "../features/cart/cartSlice";
import { stripePay } from "../features/stripe/stripeSlice";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); //get id from the paramaters of the url

  const [payWith, setPayWith] = useState("");

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
    paypalPay,
    finalizeSuccess,
    orderpayLoading: loadingPay,
    orderPaySuccess: successPay,
    orderDeliverSuccess,
    finalizeSallGoodMan,
    finalizeLoading,
  } = orderDetails;

  const { isLoading: stripeLoading } = useSelector((state) => state.stripe);
  let itemPrice = 0;

  const PayPalButton = window.paypal.Buttons.driver("react", {
    React,
    ReactDOM,
  });

  useEffect(() => {
    toast.info(
      "Test paying with a credit card using the number 424242... as the credit card number",
      { position: "top-center" }
    );
  }, []);

  useEffect(() => {
    if (!order || order._id !== id || orderDeliverSuccess) {
      dispatch(orderPayReset());
      dispatch(payOrder(id));
      dispatch(getOrderDetails(id));
      dispatch(orderDeliverReset());
    }
  }, [dispatch, order, id, successPay, orderDeliverSuccess]);

  //////////   Calculate prices

  if (isSuccess) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    itemPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(id));
  };
  ///////////////////////////////  FINALIZE //////////////////////////////

  useEffect(() => {
    if (finalizeSuccess) {
      //clear the cart
      dispatch(finalizeReset());
      if (finalizeSallGoodMan) {
        dispatch(clearCart());
        if (payWith === "stripe") {
          dispatch(stripePay(order._id));
        } else if (payWith === "paypal") {
        }
      } else {
        dispatch(getItems());
        navigate("/cart");
      }
    }
    // eslint-disable-next-line
  }, [finalizeSuccess, dispatch]);
  //////////////////////////////   STRIPE PAYMENT ////////////////////////////////////

  const onPayClick = () => {
    setPayWith("stripe");
    dispatch(finalizeOrder(id));
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

  //////////////////////////////////////   PAYPAL    ////////////////////////////////////
  const createOrderPaypal = async () => {
    dispatch(finalizeOrder(id));
    const url = "/api/orders/paypal/";
    const config = {
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const payload = await axios.get(url + id, config);

    if (payload.data.id) {
      return payload.data.id;
    } else {
      console.log("there has been a paypal related error");
    }
  };

  const onApprove = async (data, actions) => {
    console.log("frontend payment init");
    const paypalID = data.orderID;
    const url = "/api/orders/paypal/";
    const config = {
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.post(url + id, { paypalID: paypalID }, config);
    dispatch(paymentComplete());
  };

  useEffect(() => {
    dispatch(getOrderDetails(id));
    dispatch(paymentCompleteReset());
    // eslint-disable-next-line
  }, [paypalPay, dispatch]);

  /////////////////////////////////////    VISUAL    //////////////////////////////////////

  return isLoading ? (
    <Loader />
  ) : isError ? (
    <Message variant="danger">{message}</Message>
  ) : isSuccess ? (
    <div className="p-5">
      <ToastContainer
        theme="colored"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="btn btn-light my-3 ">
        Go Back
      </button>
      <h1 className="main-color-in small-screen-small-font popping-font">
        Order ID: {order._id}
      </h1>
      <div className="order-screen-container popping-font">
        <div className="order-screen-left">
          <div className="list-group list-group-flush">
            <div className="list-group-item">
              <h2 className="main-color-in">Shipping</h2>
              <p>
                <strong>Name: </strong> {userInfo.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt.split("T")[0]}
                </Message>
              ) : (
                <Message variant="info">Not Delivered</Message>
              )}
            </div>

            <div className="list-group-item">
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt.split("T")[0]}
                </Message>
              ) : (
                <Message variant="info">Not Paid</Message>
              )}
            </div>

            <div className="list-group-item">
              <h2 className="main-color-in">Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <div className="list-group list-group-flush">
                  {order.orderItems.map((item, index) => (
                    <div className="place-order-items-container" key={index}>
                      <div className="placeorder-img-container">
                        <img
                          className="fluid-img placeorder-img"
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div className="col">
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`/product/${item.product}`}>
                          {item.name}
                        </Link>
                      </div>
                      <div className="col col-md-4">
                        {item.qty} x ${item.price} = ${item.qty * item.price}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="order-screen-right ">
          <div className="list-group list-group-flush basic-border">
            <div className="list-group-item ">
              <h2 className="main-color-in">Order Summary</h2>
            </div>
            <div className="list-group-item">
              <div className="row">
                <div className="col">Items</div>
                <div className="col">${itemPrice}</div>
              </div>
            </div>
            <div className="list-group-item">
              <div className="row">
                <div className="col">Shipping</div>
                <div className="col">${order.shippingPrice}</div>
              </div>
            </div>
            <div className="list-group-item">
              <div className="row">
                <div className="col">Tax</div>
                <div className="col">${order.taxPrice}</div>
              </div>
            </div>
            <div className="list-group-item">
              <div className="row">
                <div className="col">Total</div>
                <div className="col">${order.totalPrice}</div>
              </div>
            </div>
            {!order.isPaid && (
              <div className="list-group-item">
                {loadingPay && <Loader />}
                <div className="d-grid gap-2">
                  <button
                    // disabled={stripeLoading || finalizeLoading}
                    className=" btn pay-button"
                    onClick={onPayClick}>
                    {stripeLoading ? (
                      <div className="spinner-border "></div>
                    ) : (
                      "Pay with Credit Card"
                    )}
                  </button>
                  <PayPalButton
                    fundingSource={"paypal"}
                    createOrder={(data, actions) =>
                      createOrderPaypal(data, actions)
                    }
                    onApprove={(data, actions) => onApprove(data, actions)}
                  />
                </div>
                <div className="d-flex justify-content-center">
                  {finalizeLoading && (
                    <div className="spinner-border d-flex justify-content-center"></div>
                  )}
                </div>
              </div>
            )}
            {/* {orderDeliverLoading && <Loader />} */}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <div className="list-group-item">
                  <button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverHandler}>
                    Mark As Delivered
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default OrderScreen;

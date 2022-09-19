import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { useNavigate, useLocation } from "react-router-dom";
import { createOrder, createOrderReset } from "../features/order/orderSlice";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentAddress } = useSelector((state) => state.shipping);
  const prevRoute = useLocation();
  const carty = useSelector((state) => state.cart);
  var cart = JSON.parse(JSON.stringify(carty)); //making a deep copy of cart to add extra params without state
  if (!currentAddress) {
    navigate("/shipping", { state: { prevRoute } });
  } else if (!cart.paymentMethod) {
  }
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0)
  );

  cart.shippingPrice = addDecimals(cart.itemsPrice < 100 ? 20 : 0);
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const orderCreate = useSelector((state) => state.order);
  const {
    order,
    createOrderSuccess: isSuccess,
    isError,
    message,
  } = orderCreate;

  useEffect(() => {
    if (isSuccess) {
      navigate(`/order/${order._id}`);
      dispatch(createOrderReset());
    }
    // eslint-disable-next-line
  }, [navigate, isSuccess, dispatch, createOrderReset]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: currentAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className=" popping-font place-order-container">
        <div className=" place-order-left ">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <h2 className="main-color-in">Shipping To</h2>
              <p>
                {currentAddress.address} , {currentAddress.city}{" "}
                {currentAddress.postalCode} , {currentAddress.country}
              </p>
            </li>

            <li className="list-group-item">
              <h2 className="main-color-in">Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <div className="list-group list-group-flush d-flex">
                  {cart.cartItems.map((item, index) => (
                    <div className="place-order-items-container" key={index}>
                      <div className="placeorder-img-container">
                        <img
                          className="placeorder-img"
                          style={{ paddingRight: "10px" }}
                          src={item.product.image}
                          alt={item.product.name}
                        />
                      </div>
                      <div className="col">
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`/product/${item.product._id}`}>
                          {item.product.name}
                        </Link>
                      </div>
                      <div className="col col-md-4">
                        {item.qty} x ${item.product.price}={" "}
                        <span style={{ fontWeight: "600" }}>
                          ${item.qty * item.product.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>
        <div className="place-order-right">
          <div className="card">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <h2 className="main-color-in">Order Summary</h2>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col">Items:</div>
                  <div className="col">${cart.itemsPrice}</div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col">Shipping:</div>
                  {cart.shippingPrice > 0 ? (
                    <div className="col">${cart.shippingPrice}</div>
                  ) : (
                    <div className="col">Free</div>
                  )}
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col">Tax:</div>
                  <div className="col">${cart.taxPrice}</div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col">Total:</div>
                  <div className="col">${cart.totalPrice}</div>
                </div>
              </li>
              <li className="list-group-item">
                {isError && <Message variant="danger">{message}</Message>}
              </li>
              <li className="list-group-item d-flex justify-content-center">
                <button
                  type="button"
                  className="btn "
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}>
                  Place Order
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderScreen;

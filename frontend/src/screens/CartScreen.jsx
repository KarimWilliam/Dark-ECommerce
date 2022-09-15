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
  removeItem,
  addToLoggedCart,
  getItems,
  reset,
  deleteItem,
  resetCartAddError,
} from "../features/cart/cartSlice";
import Message from "../components/Message";
import Meta from "../components/Meta";

function CartScreen() {
  const { currentAddress } = useSelector((state) => state.shipping);
  const { id } = useParams(); //get id from the paramaters of the url
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [greyOut, setGreyOut] = useState("list-group-item");
  const [searchParams] = useSearchParams();
  let qty = Number(searchParams.get("qty"));
  if (!qty) {
    qty = Number(1);
  }

  const {
    deleteSuccess,
    cartItems,
    isLoading,
    addToLoggedCartSuccess,
    addToLoggedCartLoading,
    addToLoggedCartError,
  } = useSelector((state) => state.cart);

  const { cartSteal } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  const prevRoute = useLocation();

  useEffect(() => {
    if (addToLoggedCartError) {
      dispatch(resetCartAddError());
      setGreyOut("list-group-item ");
    }
  }, [dispatch, addToLoggedCartError]);

  useEffect(() => {
    if (addToLoggedCartSuccess) {
      dispatch(getItems());
      dispatch(reset());
      setGreyOut("list-group-item ");
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
    setGreyOut("list-group-item grey-out");
    let id = item.product._id;
    let qty = Number(e.target.value);
    let z = { id, qty };
    dispatch(addToLoggedCart(z));
  };

  return (
    <>
      <Meta title={"- Shopping Cart"} />
      {cartSteal &&
        cartSteal.map((item) => (
          <Message>
            {item.name} was removed from your cart because we didnt have enough
            supply
          </Message>
        ))}
      <h2 className="main-color-in" style={{ paddingTop: "20px" }}>
        Shopping Cart
      </h2>
      <div className="row">
        <div className="col col-md-8  cart-container ">
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to="/">Go Back</Link>
            </Message>
          ) : (
            <ul className="list-group list-group-flush   ">
              {cartItems.map((item) => (
                <li
                  style={{ paddingTop: "20px", paddingBottom: "20px" }}
                  className={greyOut}
                  key={item.product._id}>
                  <div className="row cart-items ">
                    <div className="col col-md-2 cart-img ">
                      <Link to={`/product/${item.product._id}`}>
                        <img
                          className="img-fluid"
                          style={{ minWidth: "100px" }}
                          src={item.product.image}
                          alt={item.product.name}
                        />
                      </Link>
                    </div>
                    <div className="col col-md-3 cart-name">
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/product/${item.product._id}`}>
                        {item.product.name}
                      </Link>
                    </div>
                    <div className="col col-md-2 cart-price ">
                      ${item.product.price}
                    </div>
                    <div className="col col-md-2 cart-select">
                      <select
                        className="form-select  form-select-sm "
                        style={{ width: "110px" }}
                        onChange={(e) => handleOnChange(item, e)}
                        value={item.qty}
                        aria-label="Default select example">
                        {item.product.countInStock <= 30
                          ? [...Array(item.product.countInStock).keys()].map(
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
                    <div className="col col-md-2 cart-trash">
                      <button
                        className=" btn btn-light"
                        type="button"
                        id="trashButton"
                        onClick={() => removeFromCartHandler(item.product._id)}>
                        <i
                          style={{ color: "darkred" }}
                          className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          className="col col-md-4 cart-subtotal  "
          style={{ minWidth: "320px" }}>
          <div className="card checkout-container ">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <h2>
                  <span
                    style={{
                      whiteSpace: "nowrap",
                    }}>
                    Subtotal
                  </span>
                  <span
                    style={{
                      whiteSpace: "nowrap",
                    }}>
                    (
                    {cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}
                    )
                  </span>
                  <span
                    style={{
                      whiteSpace: "nowrap",
                    }}>
                    items
                  </span>
                </h2>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.product.price, 0)
                  .toFixed(2)}
              </li>
              <li className="list-group-item d-flex justify-content-center align-items-center">
                <button
                  style={{
                    textTransform: "capitalize",
                  }}
                  type="button"
                  className="btn-dark btn main-color "
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}>
                  Proceed <span style={{ textTransform: "lowercase" }}>to</span>{" "}
                  Checkout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {addToLoggedCartLoading && (
        <div className="spinner-border custom-loader" />
      )}
    </>
  );
}

export default CartScreen;

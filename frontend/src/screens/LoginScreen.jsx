import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { login, reset, resetLogInSuccess } from "../features/auth/authSlice";
import { resetCartItems, mergeCarts } from "../features/cart/cartSlice";
import { getDefaultAddress } from "../features/shipping/shippingSlice";

const LoginScreen = ({ prevPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.auth);
  const { message, isLoading, isError, user, loggedInSuccess } = userLogin;

  useEffect(() => {
    dispatch(resetLogInSuccess());
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (prevPage) {
        navigate(prevPage.prevRoute.pathname);
      } else {
        navigate("/");
      }
    }
    // eslint-disable-next-line
  }, [user, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };
  useEffect(() => {
    if (loggedInSuccess) {
      reconcileCarts();
      dispatch(getDefaultAddress());
      dispatch(resetLogInSuccess());
    }
    // eslint-disable-next-line
  }, [loggedInSuccess, dispatch]);

  function reconcileCarts() {
    const tempCartItems = window.sessionStorage.getItem("cartItems")
      ? JSON.parse(window.sessionStorage.getItem("cartItems"))
      : [];

    dispatch(mergeCarts(tempCartItems));
    dispatch(resetCartItems());
  }

  return (
    <div className="p-5">
      <FormContainer>
        <h2 className="main-color-in">Sign In</h2>
        {isError && <Message variant="danger">{message}</Message>}
        {isLoading && <Loader />}
        <form onSubmit={submitHandler}>
          <div className="form-floating mb-3">
            <input
              style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
              className="form-control"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}></input>
            <label>Email Address</label>
          </div>

          <div className="form-floating mb-3">
            <input
              style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
              className="form-control"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}></input>
            <label>Password</label>
          </div>
          <br></br>
          <button className="button-1 " type="submit">
            Sign In
          </button>
        </form>
        <div className="row py-3">
          <div className="col">
            New Customer?{" "}
            <Link className="main-color-in" to={"/register"}>
              Register
            </Link>
          </div>

          <div className="col">
            Forgot Password?{" "}
            <Link className="main-color-in" to={"/forgotPassword"}>
              Reset Password
            </Link>
          </div>
        </div>
      </FormContainer>
      <div className="bottom-message">
        <Message>
          If you are interested in testing out an Admin account, contact me via
          the About page!
        </Message>
      </div>
    </div>
  );
};

LoginScreen.defaultProps = {
  prevPage: "",
};

export default LoginScreen;

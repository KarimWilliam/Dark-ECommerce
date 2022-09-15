import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { login, reset, resetLogInSuccess } from "../features/auth/authSlice";
import { resetCartItems, mergeCarts } from "../features/cart/cartSlice";
import { getDefaultAddress } from "../features/shipping/shippingSlice";

const LoginScreen = ({ prevPage }) => {
  // const { prevPage } = useLocation();
  console.log(prevPage);
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
    console.log(prevPage);
    if (user) {
      if (prevPage) {
        console.log("routing to: " + prevPage.pathname.pathname);
        navigate(prevPage.prevRoute.pathname);
      } else {
        navigate("/");
      }
    }
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
  }, [loggedInSuccess]);

  function reconcileCarts() {
    const tempCartItems = window.sessionStorage.getItem("cartItems")
      ? JSON.parse(window.sessionStorage.getItem("cartItems"))
      : [];

    dispatch(mergeCarts(tempCartItems));
    dispatch(resetCartItems());
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {isError && <Message variant="danger">{message}</Message>}
      {isLoading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          New Customer? <Link to={"/register"}>Register</Link>
        </Col>

        <Col>
          Forgot Password? <Link to={"/forgotPassword"}>Reset Password</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

LoginScreen.defaultProps = {
  prevPage: "",
};

export default LoginScreen;

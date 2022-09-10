import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { resetResetLink, forgotPassword } from "../features/auth/authSlice";
function ForgotPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState(null);
  const { message, isError, resetLink, isResetSuccess } = useSelector(
    (state) => state.auth
  );

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };
  useEffect(() => {
    if (isResetSuccess) {
      setEmailMessage("Reset Link has been sent to your email");
      dispatch(resetResetLink());
    }
  }, [isResetSuccess, dispatch]);
  return (
    <FormContainer>
      {emailMessage && <Message variant="success">{emailMessage}</Message>}
      {isError && <Message variant="danger">{message}</Message>}
      <h4>Enter your email to recieve a password reset link</h4>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
      {resetLink && <Message variant="success">{resetLink}</Message>}
    </FormContainer>
  );
}

export default ForgotPassword;

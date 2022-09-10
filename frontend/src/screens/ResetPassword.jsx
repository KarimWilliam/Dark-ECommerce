import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { resetPassword, resetResetLink } from "../features/auth/authSlice";

function ResetPassword() {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [Regmessage, setRegMessage] = useState(null);
  const { id, token } = useParams(); //get id from the paramaters of the url
  const { message, isError, isResetSuccess } = useSelector(
    (state) => state.auth
  );
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setRegMessage("Passwords do not match");
    } else {
      dispatch(resetPassword({ id, token, password }));
    }
  };

  useEffect(() => {
    if (isResetSuccess) {
      setRegMessage("Password changed Successfully");
      dispatch(resetResetLink());
    }
  }, [isResetSuccess, dispatch]);

  return (
    <FormContainer>
      {Regmessage && <Message variant="danger">{Regmessage}</Message>}
      {isError && <Message variant="danger">{message}</Message>}
      <h3>Reset Password</h3>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="password">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId="password2">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ResetPassword;

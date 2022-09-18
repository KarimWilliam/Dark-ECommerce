import React, { useState, useEffect } from "react";
import Message from "../components/Message";
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
    <div className="form-container">
      {emailMessage && <Message variant="success">{emailMessage}</Message>}
      {isError && <Message variant="danger">{message}</Message>}
      <h4>Enter your email to recieve a password reset link</h4>
      <form onSubmit={submitHandler}>
        <section className="form-group">
          <label>Email Address</label>
          <input
            className="form-control"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}></input>
        </section>

        <button className="btn" type="submit" variant="primary">
          Submit
        </button>
      </form>
      {resetLink && <Message variant="success">{resetLink}</Message>}
    </div>
  );
}

export default ForgotPassword;

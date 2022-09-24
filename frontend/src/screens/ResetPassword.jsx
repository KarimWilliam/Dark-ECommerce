import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { resetPassword, resetResetLink } from "../features/auth/authSlice";

function ResetPassword() {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [Regmessage, setRegMessage] = useState(null);
  const [sucMessage, setSucMessage] = useState(null);
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
      setSucMessage("Password changed Successfully");
      dispatch(resetResetLink());
    }
  }, [isResetSuccess, dispatch]);

  return (
    <div className="p-5">
      <FormContainer>
        {Regmessage && <Message variant="danger">{Regmessage}</Message>}
        {sucMessage && <Message variant="success">{sucMessage}</Message>}
        {isError && <Message variant="danger">{message}</Message>}
        <h3 className="main-color-in">Reset Password</h3>
        <form onSubmit={submitHandler}>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}></input>
            <label style={{ opacity: 0.7 }}>New Password</label>
          </div>

          <div className="form-floating mb-3">
            <input
              className="form-control"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}></input>
            <label style={{ opacity: 0.7 }}>Confirm Password</label>
          </div>

          <button type="submit" className="btn">
            Submit
          </button>
        </form>
      </FormContainer>
    </div>
  );
}

export default ResetPassword;

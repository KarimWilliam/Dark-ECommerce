import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register, reset } from "../features/auth/authSlice";
import PasswordStrengthBar from "react-password-strength-bar";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Regmessage, setRegMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRegister = useSelector((state) => state.auth);
  const { isLoading, isError, user, message } = userRegister;

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setRegMessage("Passwords do not match");
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <FormContainer>
      <h1 className="main-color-in">Sign Up</h1>
      {Regmessage && <Message variant="danger">{Regmessage}</Message>}
      {isError && <Message variant="danger">{message}</Message>}
      {isLoading && <Loader />}
      <form onSubmit={submitHandler}>
        <div className="form-floating mb-3">
          <input
            style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
            className="form-control"
            type="name"
            id="nameInput"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}></input>
          <label style={{ opacity: "0.7" }} htmlFor="nameInput">
            Name
          </label>
        </div>

        <div className="form-floating mb-3">
          <input
            style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
            className="form-control"
            type="email"
            id="nameInput"
            placeholder="Enter name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}></input>
          <label style={{ opacity: "0.7" }} htmlFor="nameInput">
            Email
          </label>
        </div>

        <div className="form-floating mb-3">
          <input
            style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
            className="form-control"
            type="password"
            autoComplete="new-password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}></input>
          <label style={{ opacity: "0.7" }}>Password</label>
        </div>

        <div className="form-floating mb-3">
          <input
            style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
            className="form-control"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}></input>
          <label style={{ opacity: 0.7 }}>Confirm Password</label>
        </div>
        <br></br>
        <PasswordStrengthBar password={password} />
        <br></br>
        <button type="submit" className="btn">
          Register
        </button>
      </form>

      <div className=" row py-3">
        <div className="col">
          Have an Account?{" "}
          <Link className="main-color-in" to={"/login"}>
            Login
          </Link>
        </div>
      </div>
    </FormContainer>
  );
};

export default RegisterScreen;

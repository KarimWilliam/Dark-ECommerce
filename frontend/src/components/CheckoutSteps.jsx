import React from "react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ step1, step2, step4, high }) => {
  let y = "underline nav-item";
  let x = "nav-item";
  if (high) {
    x = "underline nav-item";
    y = "nav-item";
  }
  return (
    <div className=" navbar-expand-lg navbar justify-content-center mb-4">
      <li className="nav-item" style={{ listStyleType: "none" }}>
        {step1 ? (
          <Link style={{ textDecoration: "none" }} to="/login">
            <div className="nav-link active">Sign In </div>
          </Link>
        ) : (
          <a className="nav-link disabled">Sign In </a>
        )}
      </li>

      <li className="nav-item" style={{ listStyleType: "none" }}>
        {true ? (
          <Link style={{ textDecoration: "none" }} to="/cart">
            <div>Cart</div>
          </Link>
        ) : (
          <a className="nav-link disabled">Cart</a>
        )}
      </li>

      <li className={x} style={{ listStyleType: "none" }}>
        {step2 ? (
          <Link style={{ textDecoration: "none" }} to="/shipping">
            <div>Ship to</div>
          </Link>
        ) : (
          <a className="nav-link disabled">Ship to</a>
        )}
      </li>
      <li className={y} style={{ listStyleType: "none", y }}>
        {step4 ? (
          <Link style={{ textDecoration: "none" }} to="/placeorder">
            <div className="nav-link active">Place Order</div>
          </Link>
        ) : (
          <a className="nav-link disabled">Place Order</a>
        )}
      </li>
    </div>
  );
};

export default CheckoutSteps;

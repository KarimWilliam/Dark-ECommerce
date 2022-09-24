import React from "react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ step1, step2, step4, high, low }) => {
  let y = "underline nav-item";
  let x = "nav-item";
  let z = "nav-item";
  if (high) {
    x = "underline nav-item";
    y = "nav-item";
  }
  if (low) {
    z = "underline nav-item ";
    y = "nav-item";
    x = "nav-item";
  }
  return (
    <div className=" navbar-expand-lg navbar justify-content-center mb-4 ">
      <li className={z} style={{ listStyleType: "none" }}>
        {step1 ? (
          <Link style={{ textDecoration: "none" }} to="/cart">
            <h5 className="nav-link active main-color-in">Cart </h5>
          </Link>
        ) : (
          <a href="/" className="nav-link disabled">
            Cart
          </a>
        )}
      </li>

      <li className={x} style={{ listStyleType: "none" }}>
        {step2 ? (
          <Link style={{ textDecoration: "none" }} to="/shipping">
            <h5 className="main-color-in">Ship to</h5>
          </Link>
        ) : (
          <Link style={{ textDecoration: "none" }} to="/login">
            <a href="/" className="nav-link disabled">
              Ship to
            </a>
          </Link>
        )}
      </li>
      <li className={y} style={{ listStyleType: "none", y }}>
        {step4 ? (
          <Link style={{ textDecoration: "none" }} to="/placeorder">
            <h5 className="nav-link active main-color-in">Place Order</h5>
          </Link>
        ) : (
          <Link style={{ textDecoration: "none" }} to="/login">
            <a href="/" className="nav-link disabled">
              <h5 className="main-color-in">Place Order</h5>
            </a>
          </Link>
        )}
      </li>
    </div>
  );
};

export default CheckoutSteps;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetUser } from "../features/auth/authSlice";
import { ordersListReset } from "../features/order/orderSlice";
import { userListReset } from "../features/user/userSlice";
import SearchBox from "./SearchBox";
import { useNavigate } from "react-router-dom";
import { resetCartItems } from "../features/cart/cartSlice";
import { setCurrentAddress } from "../features/shipping/shippingSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const userLogin = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = userLogin;
  const logoutHandler = () => {
    dispatch(logout());
    dispatch(resetUser());
    dispatch(ordersListReset());
    dispatch(userListReset());
    dispatch(resetCartItems());
    dispatch(setCurrentAddress([]));
    window.localStorage.setItem("currentAddress", []);
    window.sessionStorage.setItem("cartItems", []); //TODO
    window.localStorage.setItem("defaulyAddress", []);
    window.localStorage.setItem("defaultAddress", []);
    navigate("/");
  };
  const { cartItems } = useSelector((state) => state.cart);
  const [add, setAdd] = useState("");
  const { currentAddress, defaultAddress } = useSelector(
    (state) => state.shipping
  );
  useEffect(() => {
    try {
      if (user) {
        setAdd("address");
      }
      if (currentAddress) {
        if (currentAddress.city.length > 0) {
          setAdd(`Shipping to ${currentAddress.city}`);
        }
      } else if (defaultAddress) {
        if (defaultAddress.city.length > 0) {
          setAdd(`Shipping to ${defaultAddress.city}`);
        }
      }
    } catch (error) {
      setAdd("");
    }
  }, [currentAddress, defaultAddress, user]);

  const sum = cartItems.reduce((accumulator, object) => {
    return accumulator + object.qty;
  }, 0);

  return (
    <header>
      <nav className=" navbar navbar-dark black-color navbar-expand-xl fixed-top py-2">
        <div className="container-fluid gap-3" style={{ display: "flex" }}>
          <Link
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            to="/"
            className="navbar-brand secondary-color-in gap-5"
            style={{ fontFamily: "Quicksand" }}>
            Dark-Commerce
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navmenu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="navbar-nav "
            id="navSearch"
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
            }}>
            <SearchBox />
          </div>

          <div
            className="collapse navbar-collapse "
            id="navmenu"
            style={{
              flexGrow: 0,
              flexShrink: 1,
              flexBasis: "auto",
              textTransform: "capitalize",
            }}>
            <ul className="navbar-nav ms-auto ">
              <li className="nav-item">
                <Link to="/about" className="nav-link">
                  About
                </Link>
              </li>
              {user ? (
                <div
                  className="nav-item dropdown"
                  title={user.name}
                  id="userMenu">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    {user.name}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="/Address">
                        Address
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/profile">
                        Profile
                      </a>
                    </li>
                    <li>
                      <div
                        className="dropdown-item"
                        onClick={logoutHandler}
                        style={{ cursor: "pointer" }}>
                        Logout
                      </div>
                    </li>
                  </ul>
                </div>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    <i className="fas fa-user"></i> Sign In
                  </Link>
                </li>
              )}
              {user && user.isAdmin && (
                <div className="nav-item dropdown" title="Admin" id="adminmenu">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Admin
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="/admin/userlist">
                        Users
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/admin/productlist">
                        Products
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/admin/orderlist">
                        Orders
                      </a>
                    </li>
                  </ul>
                </div>
              )}
              <li className="nav-item">
                <Link to="/Address" className="nav-link ">
                  {add}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/cart"
                  className="nav-link "
                  style={{ whitSpace: "nowrap" }}>
                  <i className="fas fa-shopping-cart  "></i>
                  <span
                    className="badge badge-warning secondary-color-in"
                    id="lblCartCount">
                    {sum}
                  </span>
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* padding for the nav bar */}
      <div style={{ paddingTop: "98px" }}></div>
    </header>
  );
};

export default Header;

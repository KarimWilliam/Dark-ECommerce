import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
//import { Link } from "react-router-dom";
import { logout, resetUser } from "../features/auth/authSlice";
import { ordersListReset } from "../features/order/orderSlice";
import { userListReset } from "../features/user/userSlice";
import SearchBox from "./SearchBox";
import { useNavigate } from "react-router-dom";
import { resetCartItems } from "../features/cart/cartSlice";

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
    window.sessionStorage.setItem("cartItems", []); //TODO
    navigate("/");
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Dark-Commerce</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
          <SearchBox></SearchBox>
          <nav className="ml-auto">
            <LinkContainer to="/cart">
              <Nav.Link>
                <i className="fas fa-shopping-cart"></i> cart
              </Nav.Link>
            </LinkContainer>
            {user ? (
              <NavDropdown title={user.name} id="username">
                <LinkContainer to="/Address">
                  <NavDropdown.Item>Address</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>
                  <i className="fas fa-user"></i> Sign In
                </Nav.Link>
              </LinkContainer>
            )}
            <Nav.Link href="/cart"></Nav.Link>
            <Nav.Link href="/login"></Nav.Link>
            {user && user.isAdmin && (
              <NavDropdown title="Admin" id="adminmenu">
                <LinkContainer to="/admin/userlist">
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/productlist">
                  <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/orderlist">
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserProfile } from "../features/user/userSlice";
import { updateUserProfile, reset } from "../features/auth/authSlice";
import { getAllUserOrders } from "../features/order/orderSlice";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ProfMessage, setProfMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { isLoading, isError, user, message } = userDetails;

  const userLogin = useSelector((state) => state.auth);
  const { user: loggedInUser, isSuccess } = userLogin;

  const {
    isLoading: loadingOrders,
    isError: errorOrders,
    message: orderMessage,
    isSuccess: successOrders,
    orders,
  } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    console.log("useeffect");
    if (!loggedInUser) {
      navigate("/login");
    } else {
      if (!user) {
        dispatch(getUserProfile(loggedInUser));
        dispatch(getAllUserOrders());
      } else {
        setName(loggedInUser.name);
        setEmail(loggedInUser.email);
      }
    }
  }, [navigate, loggedInUser, user, dispatch, userDetails]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setProfMessage("Passwords do not match");
    } else {
      dispatch(
        updateUserProfile({
          _id: user._id,
          name,
          email,
          password,
          token: loggedInUser.token,
        })
      );
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {ProfMessage && <Message variant="danger">{ProfMessage}</Message>}
        {isError && <Message variant="danger">{message}</Message>}
        {isSuccess && <Message variant="success"> Profile Updated</Message>}
        {isLoading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}></Form.Control>
          </Form.Group>

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
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message varient="danger"> {orderMessage}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}></i>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}></i>
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <button className="btn-sm" variant="light">
                          Details
                        </button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;

import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listOrders } from "../features/order/orderSlice";
import { useNavigate } from "react-router-dom";

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    allOrdersLoading: isLoading,
    allOrdersError: isError,
    orders,
    allOrdersMessage: message,
  } = useSelector((state) => state.order);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "Dark E-Commerce | Admin Order List"; //set title for docment
    if (user && user.isAdmin) {
      // dispatch(allOrdersReset());
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, user]);

  return (
    <>
      <h1>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{message}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;

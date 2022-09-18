import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listOrders } from "../features/order/orderSlice";
import { useNavigate } from "react-router-dom";
import SortFunction from "../components/SortFunction";
import { allOrdersReset } from "../features/order/orderSlice";

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [displayOrders, setDisplayOrders] = useState([]);
  const [sortDirectionTotal, setSortDirectionTotal] = useState(false);
  const [sortDirectionDate, setSortDirectionDate] = useState(false);
  const [sortDirectionID, setSortDirectionID] = useState(false);
  const [sortDirectionPaid, setSortDirectionPaid] = useState(false);
  const [sortDirectionDelivered, setSortDirectionDelivered] = useState(false);

  const {
    allOrdersLoading: isLoading,
    allOrdersError: isError,
    orders,
    allOrdersMessage: message,
    allOdersSuccess,
  } = useSelector((state) => state.order);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "Dark E-Commerce | Admin Order List"; //set title for docment
    if (user && user.isAdmin) {
      dispatch(allOrdersReset());
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, user]);

  useEffect(() => {
    if (allOdersSuccess) {
      setDisplayOrders(orders);
    }
    dispatch(allOrdersReset());
  }, [allOdersSuccess, dispatch, orders]);

  const sortByTotal = () => {
    setSortDirectionTotal(!sortDirectionTotal);
    setDisplayOrders(
      SortFunction(displayOrders, sortDirectionTotal, "totalPrice")
    );
  };

  const sortByID = () => {
    setSortDirectionID(!sortDirectionID);
    setDisplayOrders(SortFunction(displayOrders, sortDirectionID, "_id"));
  };
  const sortByDate = () => {
    setSortDirectionDate(!sortDirectionDate);
    setDisplayOrders(
      SortFunction(displayOrders, sortDirectionDate, "createdAt")
    );
  };
  const sortByPaid = () => {
    setSortDirectionPaid(!sortDirectionPaid);
    setDisplayOrders(SortFunction(displayOrders, sortDirectionPaid, "isPaid"));
  };
  const sortByDelivered = () => {
    setSortDirectionDelivered(!sortDirectionDelivered);
    setDisplayOrders(
      SortFunction(displayOrders, sortDirectionDelivered, "isDelivered")
    );
  };

  return (
    <>
      <h1 className="main-color-in">Orders</h1>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{message}</Message>
      ) : (
        <div className="table-responsive ">
          <table className="table table-sm table-striped table-hover table-bordered">
            <thead>
              <tr>
                <th
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}>
                  <button
                    className="btn"
                    style={{ flex: 1 }}
                    onClick={() => {
                      sortByID();
                    }}>
                    ID
                  </button>
                </th>
                <th>
                  <button
                    className="btn"
                    style={{ flex: 1 }}
                    onClick={() => {
                      sortByDate();
                    }}>
                    DATE
                  </button>
                </th>
                <th>
                  <button
                    className="btn"
                    style={{ flex: 1 }}
                    onClick={() => {
                      sortByTotal();
                    }}>
                    TOTAL
                  </button>
                </th>
                <th>
                  <button
                    className="btn"
                    style={{ flex: 1 }}
                    onClick={() => {
                      sortByPaid();
                    }}>
                    PAID
                  </button>
                </th>
                <th style={{}}>
                  <button
                    className="btn"
                    onClick={() => {
                      sortByDelivered();
                    }}>
                    DELIVERED
                  </button>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                displayOrders.map((order) => (
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
                      <Link to={`/order/${order._id}`}>
                        <button className="btn-sm  black-color">Details</button>
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OrderListScreen;

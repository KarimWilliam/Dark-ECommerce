import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserProfile } from "../features/user/userSlice";
import { updateUserProfile, reset } from "../features/auth/authSlice";
import { getAllUserOrders, orderReset } from "../features/order/orderSlice";
import SortFunction from "../components/SortFunction";

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

  const [displayOrders, setDisplayOrders] = useState([]);
  const [sortDirectionTotal, setSortDirectionTotal] = useState(false);
  const [sortDirectionDate, setSortDirectionDate] = useState(false);
  const [sortDirectionID, setSortDirectionID] = useState(false);
  const [sortDirectionPaid, setSortDirectionPaid] = useState(false);
  const [sortDirectionDelivered, setSortDirectionDelivered] = useState(false);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (successOrders) {
      setDisplayOrders(orders);
    }
    dispatch(orderReset());
  }, [dispatch, successOrders, orders]);

  useEffect(() => {
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
    <div className="row p-5">
      {/* <div className="col col-md-3 profile-left">
        <h2 className="main-color-in">Update My Info</h2>
        {ProfMessage && <Message variant="danger">{ProfMessage}</Message>}
        {isError && <Message variant="danger">{message}</Message>}
        {isSuccess && <Message variant="success"> Profile Updated</Message>}
        {isLoading && <Loader />}
        <form onSubmit={submitHandler}>
          <label>Name</label>
          <input
            style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
            className="form-control"
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}></input>

          <label>Email Address</label>
          <input
            style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
            className="form-control"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}></input>

          <label>Password</label>
          <input
            style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
            className="form-control"
            type="password"
            autoComplete="new-password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}></input>

          <label>Confirm Password</label>
          <input
            style={{ backgroundColor: "rgba(0, 0, 0, 0.06)" }}
            className="form-control"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}></input>

          <button className="btn " type="submit">
            Update
          </button>
        </form>
      </div> */}
      <div className="col">
        <h2 className="main-color-in">My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message varient="danger"> {orderMessage}</Message>
        ) : (
          <div className="table-responsive ">
            <table className="table table-sm table-striped table-hover table-bordered">
              <thead>
                <tr>
                  <th
                    style={{ textAlign: "center" }}
                    className="address-hover-effect"
                    onClick={() => {
                      sortByID();
                    }}>
                    ID
                  </th>
                  <th
                    style={{ textAlign: "center" }}
                    className="address-hover-effect"
                    onClick={() => {
                      sortByDate();
                    }}>
                    DATE
                  </th>
                  <th
                    style={{ textAlign: "center" }}
                    className="address-hover-effect"
                    onClick={() => {
                      sortByTotal();
                    }}>
                    TOTAL
                  </th>
                  <th
                    style={{ textAlign: "center" }}
                    className="address-hover-effect th"
                    onClick={() => {
                      sortByDelivered();
                    }}>
                    DELIVERED
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
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          // <i
                          //   className="fas fa-times"
                          //   style={{ color: "red" }}></i>
                          <div className="main-color-in">In Progress...</div>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Link to={`/order/${order._id}`}>
                          <button
                            className="btn "
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "block",
                              padding: "10px",
                              border: "none",
                            }}>
                            Details {"  "}
                            <i className="fas fa-arrow-right"> </i>
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;

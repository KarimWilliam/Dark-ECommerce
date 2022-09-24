import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import {
  listUsers,
  deleteUser,
  deleteReset,
  reset,
} from "../features/user/userSlice";
import { Link } from "react-router-dom";
import SortFunction from "../components/SortFunction";

const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userList = useSelector((state) => state.userDetails);
  const { isLoading, isError, users, message, deleteSuccess, isSuccess } =
    userList;

  const userLogin = useSelector((state) => state.auth);
  const { user } = userLogin;

  useEffect(() => {
    if (user && user.isAdmin) {
      dispatch(listUsers());
      dispatch(deleteReset());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, user, deleteSuccess]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteUser(id));
    }
  };

  const [displayUsers, setDisplayUsers] = useState([]);
  const [sortDirectionName, setSortDirectionName] = useState(false);
  const [sortDirectionAdmin, setSortDirectionAdmin] = useState(false);
  const [sortDirectionID, setSortDirectionID] = useState(false);
  const [sortDirectionEmail, setSortDirectionEmail] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setDisplayUsers(users);
    }
    dispatch(reset());
  }, [dispatch, isSuccess, users]);

  const sortByID = () => {
    setSortDirectionID(!sortDirectionID);
    setDisplayUsers(SortFunction(displayUsers, sortDirectionID, "_id"));
  };
  const sortByName = () => {
    setSortDirectionName(!sortDirectionName);
    setDisplayUsers(SortFunction(displayUsers, sortDirectionName, "name"));
  };
  const sortByEmail = () => {
    setSortDirectionEmail(!sortDirectionEmail);
    setDisplayUsers(SortFunction(displayUsers, sortDirectionEmail, "email"));
  };
  const sortByAdmin = () => {
    setSortDirectionAdmin(!sortDirectionAdmin);
    setDisplayUsers(SortFunction(displayUsers, sortDirectionAdmin, "isAdmin"));
  };

  return (
    <>
      <h2 className="main-color-in">Users</h2>
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
                    sortByName();
                  }}>
                  Name
                </th>
                <th
                  style={{ textAlign: "center" }}
                  className="address-hover-effect"
                  onClick={() => {
                    sortByEmail();
                  }}>
                  Email
                </th>
                <th
                  style={{ textAlign: "center" }}
                  className="address-hover-effect"
                  onClick={() => {
                    sortByAdmin();
                  }}>
                  Admin
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {displayUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <i
                        className="fas fa-check"
                        style={{ color: "green" }}></i>
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <Link to={`/admin/user/${user._id}/edit`}>
                      <button className="btn">
                        <i className="fas fa-edit"></i>
                      </button>
                    </Link>
                    <button
                      className="btn trashButton"
                      onClick={() => deleteHandler(user._id)}>
                      <i className="fas fa-trash"></i>
                    </button>
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

export default UserListScreen;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUserDetails,
  updateUser,
  updateReset,
} from "../features/user/userSlice";

const UserEditScreen = () => {
  const { id: userId } = useParams(); //get id from the paramaters of the url
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const {
    isLoading,
    isError,
    user,
    message,
    updateIsError,
    updateIsSuccess,
    updateIsLoading,
    updateMessage,
  } = userDetails;

  useEffect(() => {
    //always get details the first refresh
    dispatch(getUserDetails(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (updateIsSuccess) {
      dispatch(updateReset());
      navigate("/admin/userlist");
    } else {
      if (!user || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, navigate, userId, user, updateIsSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {updateIsLoading && <Loader />}
        {updateIsError && <Message variant="danger">{updateMessage}</Message>}
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">{message}</Message>
        ) : (
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

            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;

import axios from "axios";
const API_URL = "/api/users/";

//get User Details
const getUserDetails = async (userID, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + userID, config);

  return response.data;
};

//put User Profile
const getUserProfile = async (user) => {
  const { token } = user;
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + "profile", user, config);

  return response.data;
};

//list all users
const listUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

//delete a user by id
const deleteUser = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(API_URL + id);
  const response = await axios.delete(API_URL + id, config);

  return response.data;
};
//update a user by id   ///  _id: userId, name, email, isAdmin
const updateUser = async (userInfo, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + userInfo._id, userInfo, config);

  return response.data;
};

const userService = {
  getUserDetails,
  getUserProfile,
  listUsers,
  deleteUser,
  updateUser,
};

export default userService;

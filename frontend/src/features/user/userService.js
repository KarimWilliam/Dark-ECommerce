import axios from "axios";
const API_URL = "/api/users/";

//get User Details
const getUserDetails = async (user) => {
  const { _id, token } = user;
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + _id, config);

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

//put User Profile
const listUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

const userService = {
  getUserDetails,
  getUserProfile,
  listUsers,
};

export default userService;

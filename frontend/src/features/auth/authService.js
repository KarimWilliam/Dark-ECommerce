import axios from "axios";
const API_URL = "/api/users/";

// Login user
const login = async (userData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post(API_URL + "login", userData, config);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

//LOGOUT user
const logout = async () => {
  localStorage.removeItem("user");
};

//register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

//update  User Profile
const updateUserProfile = async (user) => {
  const { token } = user;
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + "profile", user, config);
  localStorage.setItem("user", JSON.stringify(response.data));
  return response.data;
};

const authService = {
  login,
  logout,
  register,
  updateUserProfile,
};

export default authService;

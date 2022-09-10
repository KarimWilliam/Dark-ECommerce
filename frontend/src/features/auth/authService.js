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
  localStorage.removeItem("defaultAddress");
  localStorage.removeItem("defaulyAddress");
  localStorage.removeItem("currentAddress");
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

// send the forgot password email to the user's email
const forgotPassword = async (email) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post(
    API_URL + "forgotPassword",
    { email: email },
    config
  );
  return response.data;
};

//reset User Password
const resetPassword = async (user) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log(user);
  const response = await axios.post(
    API_URL + "resetPassword/" + user.id + "/" + user.token,
    { password: user.password },
    config
  );
  return response.data;
};

const authService = {
  login,
  logout,
  register,
  updateUserProfile,
  resetPassword,
  forgotPassword,
};

export default authService;

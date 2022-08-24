import axios from "axios";
const API_URL = "/api/shipping/";

// Create a new address
const createAddress = async (address, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, address, config);

  response.data.forEach((element) => {
    if (element.default === true) {
      window.sessionStorage.setItem("currentAddress", JSON.stringify(element));
    }
  });
  return response.data;
};

// Sets a default address
const setDefaultAddress = async (id, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + id, {}, config);

  if (response.data) {
    window.sessionStorage.setItem(
      "currentAddress",
      JSON.stringify(response.data)
    );
  }

  return response.data;
};

// gets a default address
const getDefaultAddress = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);

  if (response.data) {
    window.sessionStorage.setItem(
      "currentAddress",
      JSON.stringify(response.data)
    );
  }

  return response.data;
};

// deletes one of the addresses
const deleteAddress = async (token, id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  if (id === window.sessionStorage.getItem("currentAddress")._id) {
    window.sessionStorage.setItem("currentAddress", null);
  }
  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

// edits one of the addresses
const editAddress = async (address, token, id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + id, address, config);
  response.data.forEach((element) => {
    if (element.default === true) {
      window.sessionStorage.setItem("currentAddress", JSON.stringify(element));
    }
  });
  return response.data;
};

// gets all the addresses
const getAllAddresses = async (token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const shippingService = {
  createAddress,
  setDefaultAddress,
  getDefaultAddress,
  deleteAddress,
  editAddress,
  getAllAddresses,
};

export default shippingService;

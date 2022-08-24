import axios from "axios";
const API_URL = "/api/orders/";

// create  orders
const createOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, orderData, config);

  return response.data;
};

// Get order by id
const getOrderDetails = async (orderID, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + orderID, config);

  return response.data;
};

// edit order to payed if it went through
const payOrder = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + id + "/pay", id, config);

  return response.data;
};

// Get orders for logged in user by id
const getAllUserOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + "/myorders", config);

  return response.data;
};

// Get orders for logged in user by id
const listOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get orders for logged in user by id
const deliverOrder = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + id + "/deliver", {}, config);
  return response.data;
};

const orderService = {
  createOrder,
  getOrderDetails,
  payOrder,
  getAllUserOrders,
  listOrders,
  deliverOrder,
};

export default orderService;

import axios from "axios";
const API_URL = "/api/products/";
const API_URL_CART = "/api/cart/";

// check if item exists then put it in temp cart
const addToCart = async (id, qty) => {
  const { data } = await axios.get(API_URL + id);
  const payload = {
    product: {
      _id: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
    },
    temp: true,

    qty: qty,
  };

  return payload;
};

// check if item exists and store it in the DB cart
const addToLoggedCart = async (token, id, qty) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.post(API_URL_CART + id, { qty: qty }, config);
  return data;
};

// get all items in cart
const getItems = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL_CART, config);

  return data;
};

// check if item exists and store it in the DB cart
const deleteItem = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const payload = await axios.delete(API_URL_CART + id, config);

  return payload.data;
};

// check if item exists and store it in the DB cart
const mergeCarts = async (tempCart, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const payload = await axios.post(API_URL_CART, { tempCart }, config);

  return payload.data;
};

// check if item exists and store it in the DB cart
const clearCart = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const payload = await axios.delete(API_URL_CART, config);

  return payload.data;
};

const cartService = {
  addToCart,
  addToLoggedCart,
  getItems,
  deleteItem,
  mergeCarts,
  clearCart,
};

export default cartService;

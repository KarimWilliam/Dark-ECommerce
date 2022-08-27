import axios from "axios";
const API_URL = "/api/products/";

// Get  reviews with pagination
const listProducts = async (pageNumber, keyword) => {
  // const CancelToken = axios.CancelToken;
  // const source = CancelToken.source();
  // const config = {
  //   cancelToken: source.token,
  //   headers: {},
  // };
  console.log(pageNumber);
  if (!keyword) {
    keyword = "";
  }
  if (!pageNumber) {
    pageNumber = 1;
  }

  const response = await axios.get(
    API_URL + `page/?keyword=${keyword}&pageNumber=${pageNumber}`
  );
  return response.data;
};

// Get  products
const getProducts = async (keyword) => {
  if (!keyword) {
    keyword = "";
  }
  const response = await axios.get(API_URL + `?keyword=${keyword}`);
  return response.data;
};

// Get  products for the admin (includes invisble products)
const getProductsAdmin = async (keyword, token) => {
  if (!keyword) {
    keyword = "";
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(
    API_URL + `admin/?keyword=${keyword}`,
    config
  );
  return response.data;
};

// Get  products for the admin (includes invisble products)
const updateProduct = async (productData, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    API_URL + productData._id,
    productData,
    config
  );
  return response.data;
};

// Get single product
const getProduct = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

// create a product
const createProduct = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, {}, config);
  return response.data;
};

// not in use
const listProductDetails = async (ID, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + ID, config);
  return response.data;
};

// create a review of a product
const createProductReview = async (id, review, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + id + "/reviews", review, config);
  return response.data;
};

// Get  products
const getTopProducts = async () => {
  const response = await axios.get(API_URL + "/top");
  return response.data;
};

// delete a product
const deleteProduct = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axios.delete(API_URL + id, config);
};

// hide a product from customers
const hideProduct = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + id, {}, config);
  return response.data;
};

// show a product to customers
const unHideProduct = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + "hide/" + id, {}, config);
  return response.data;
};

const productService = {
  getProducts,
  getProduct,
  listProducts,
  deleteProduct,
  createProduct,
  getProductsAdmin,
  updateProduct,
  listProductDetails,
  createProductReview,
  getTopProducts,
  hideProduct,
  unHideProduct,
};

export default productService;

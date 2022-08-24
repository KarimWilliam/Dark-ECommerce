import axios from "axios";
const API_URL = "/api/orders/stripe/";

//Stripe Payment
const stripePay = async (orderID, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + orderID, config);

  return response.data.url;
};

const stripeService = {
  stripePay,
};

export default stripeService;

import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/products/productSlice";
import cartReducer from "./features/cart/cartSlice";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import orderReducer from "./features/order/orderSlice";
import stripeReducer from "./features/stripe/stripeSlice";
import shippingReducer from "./features/shipping/shippingSlice";

//const reducer = combineReducers({});
//const initalState = {};
export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    auth: authReducer,
    userDetails: userReducer,
    order: orderReducer,
    stripe: stripeReducer,
    shipping: shippingReducer,
  },
});

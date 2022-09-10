import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "./orderService";

const initialState = {
  order: null,
  orders: [],
  isError: false,
  isSuccess: false,
  isLoading: true,
  orderPay: false,
  orderPayLoading: false,
  orderPaySuccess: false,
  message: "",
  createOrderSuccess: false,
  createOrderLoading: false,
  createOrderError: false,
  createOrderMessage: "",
  orderDeliverSuccess: false,
  orderDeliverError: false,
  orderDeliverLoading: false,
  orderDeliverMessage: "",
  allOrdersError: false,
  allOdersSuccess: false,
  allOrdersMessage: "",
  allOrdersLoading: false,
  paypalPay: false,
  cartSteal: "",
  finalizeSuccess: false,
  finalizeSuccess: false,
  finalizeLoading: false,
  finalizeError: false,
  finalizeSallGoodMan: true,
};

//  create a new order
export const createOrder = createAsyncThunk(
  "order/CreateOrder",
  async (orderData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await orderService.createOrder(orderData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//  Get order by id
export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (orderID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await orderService.getOrderDetails(orderID, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//  Get All My orders
export const getAllUserOrders = createAsyncThunk(
  "order/getAllLoggedinUserOrders",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await orderService.getAllUserOrders(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//  Get All orders for an admin
export const listOrders = createAsyncThunk(
  "order/listOrders",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await orderService.listOrders(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//  Pay order
export const payOrder = createAsyncThunk(
  "order/payOrder",
  async (orderID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await orderService.payOrder(orderID, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//  Pay order
export const deliverOrder = createAsyncThunk(
  "order/deliverOrder",
  async (orderID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await orderService.deliverOrder(orderID, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//  Finalize Order
export const finalizeOrder = createAsyncThunk(
  "order/finalizeOrder",
  async (orderID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await orderService.finalizeOrder(orderID, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    reset: (state) => {
      //state.order = null;   DONT DO THIS
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    orderReset: (state) => {
      //state.order = null;   DONT DO THIS
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    orderPayReset: (state) => {
      state.orderPay = false;
    },
    ordersListReset: (state) => {
      state.orders = [];
    },
    createOrderReset: (state) => {
      state.createOrderError = false;
      state.createOrderLoading = false;
      state.createOrderSuccess = false;
    },
    orderDeliverReset: (state) => {
      state.orderDeliverSuccess = false;
      state.orderDeliverError = false;
      state.orderDeliverLoading = false;
      state.orderDeliverMessage = "";
    },
    allOrdersReset: (state) => {
      state.allOrdersError = false;
      state.allOrdersLoading = false;
      state.allOdersSuccess = false;
      state.allOrdersMessage = "";
    },
    paymentComplete: (state) => {
      state.paypalPay = true;
    },
    paymentCompleteReset: (state) => {
      state.paypalPay = false;
    },
    finalizeReset: (state) => {
      state.finalizeSuccess = false;
      state.finalizeError = false;
      state.finalizeSallGoodMan = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.createOrderLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createOrderLoading = false;
        state.createOrderSuccess = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createOrderLoading = false;
        state.createOrderError = true;
        state.createOrderMessage = action.payload;
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.order = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(payOrder.pending, (state) => {
        state.orderPayLoading = true;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.orderPaySuccess = true;
        state.order = action.payload;
        state.orderPayLoading = false;
        state.orderPay = true;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.orderPayLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUserOrders.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(listOrders.pending, (state) => {
        state.allOrdersLoading = true;
      })
      .addCase(listOrders.fulfilled, (state, action) => {
        state.allOdersSuccess = true;
        state.orders = action.payload;
        state.allOrdersLoading = false;
      })
      .addCase(listOrders.rejected, (state, action) => {
        state.allOrdersLoading = false;
        state.allOrdersError = true;
        state.allOrdersMessage = action.payload;
      })
      .addCase(deliverOrder.pending, (state) => {
        state.orderDeliverLoading = true;
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.orderDeliverLoading = false;
        state.orderDeliverSuccess = true;
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.orderDeliverLoading = false;
        state.orderDeliverError = true;
        state.orderDeliverMessage = action.payload;
      })
      .addCase(finalizeOrder.pending, (state) => {
        state.finalizeLoading = true;
      })
      .addCase(finalizeOrder.fulfilled, (state, action) => {
        state.cartSteal = action.payload;
        console.log(action.payload);
        if (action.payload.length !== 0) {
          state.finalizeSallGoodMan = false;
        }
        state.finalizeSuccess = true;
        state.finalizeLoading = false;
      })
      .addCase(finalizeOrder.rejected, (state, action) => {
        state.finalizeError = true;
        state.finalizeLoading = false;
      });
  },
});

export const {
  orderPayReset,
  ordersListReset,
  createOrderReset,
  reset,
  orderDeliverReset,
  allOrdersReset,
  paymentComplete,
  paymentCompleteReset,
  finalizeReset,
  orderReset,
} = orderSlice.actions;
export default orderSlice.reducer;

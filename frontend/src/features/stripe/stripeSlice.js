import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stripeService from "./stripeService";

const initialState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  StripeURL: "",
};

//  Pay order with stripe
export const stripePay = createAsyncThunk(
  "stripe/stripePay",
  async (orderData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await stripeService.stripePay(orderData, token);
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

export const stripeSlice = createSlice({
  name: "stripe",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    resetURL: (state) => {
      state.StripeURL = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(stripePay.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(stripePay.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.StripeURL = action.payload;
        state.isLoading = false;
      })
      .addCase(stripePay.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, resetURL } = stripeSlice.actions;
export default stripeSlice.reducer;

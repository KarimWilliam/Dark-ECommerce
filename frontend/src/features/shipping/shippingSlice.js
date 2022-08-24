import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import shippingService from "./shippingService";

const currentAddress = JSON.parse(
  window.sessionStorage.getItem("currentAddress")
);

const initialState = {
  currentAddress: currentAddress ? currentAddress : null,
  addresses: [],
  defaultAddress: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  createAddressError: false,
  createAddressSuccess: false,
  createAddressLoading: false,
  createAddressMessage: "",
  deleteAddressError: false,
  deleteAddressSuccess: false,
  deleteAddressLoading: false,
  deleteAddressMessage: "",
  editAddressError: false,
  editAddressSuccess: false,
  editAddressLoading: false,
  editAddressMessage: "",
  defaultAddressError: false,
  defaultAddressSuccess: false,
  defaultAddressLoading: false,
  defaultAddressMessage: "",
};

// create a new address
export const createAddress = createAsyncThunk(
  "shipping/createAddress",
  async (address, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await shippingService.createAddress(address, token);
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

// set Default address
export const setDefaultAddress = createAsyncThunk(
  "shipping/setDefaultAddress",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await shippingService.setDefaultAddress(id, token);
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

// get the default address
export const getDefaultAddress = createAsyncThunk(
  "shipping/getDefaultAddress",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await shippingService.getDefaultAddress(token);
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

// delete an address
export const deleteAddress = createAsyncThunk(
  "shipping/deleteAddress",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await shippingService.deleteAddress(token, id);
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

// edit an address
export const editAddress = createAsyncThunk(
  "shipping/editAddress",
  async ({ data }, thunkAPI) => {
    const { address, id } = data;
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await shippingService.editAddress(address, token, id);
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

// get all user addresses
export const getAllAddresses = createAsyncThunk(
  "shipping/getAllAddresses",
  async ({ data }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await shippingService.getAllAddresses(token);
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

export const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    saveShippingAddress: (state, action) => {
      state.currentAddress = action.payload;
      localStorage.setItem(
        "ShippingAddress",
        JSON.stringify(state.shippingAddress)
      );
    },
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    createReset: (state) => {
      state.createAddressLoading = false;
      state.createAddressSuccess = false;
      state.createAddressError = false;
      state.createAddressMessage = "";
    },
    deleteReset: (state) => {
      state.deleteAddressError = false;
      state.defaultAddressLoading = false;
      state.deleteAddressSuccess = false;
      state.deleteAddressMessage = "";
    },
    defaultReset: (state) => {
      state.defaultAddressError = false;
      state.defaultAddressLoading = false;
      state.defaultAddressSuccess = false;
      state.defaultAddressMessage = "";
    },
    editReset: (state) => {
      state.editAddressError = false;
      state.editAddressLoading = false;
      state.editAddressSuccess = false;
      state.editAddressMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAddress.pending, (state) => {
        state.createAddressLoading = true;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.createAddressLoading = false;
        state.createAddressSuccess = true;
        state.addresses = action.payload;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.createAddressLoading = false;
        state.createAddressError = true;
        state.createAddressMessage = action.payload;
      })
      .addCase(setDefaultAddress.pending, (state) => {
        state.defaultAddressLoading = true;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.defaultAddressLoading = false;
        state.defaultAddressSuccess = true;
        state.defaultAddressMessage = action.payload;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.defaultAddressLoading = false;
        state.defaultAddressError = true;
        state.defaultAddressMessage = action.payload;
      })
      .addCase(getDefaultAddress.pending, (state) => {
        state.defaultAddressLoading = true;
      })
      .addCase(getDefaultAddress.fulfilled, (state, action) => {
        state.defaultAddressLoading = false;
        state.defaultAddressSuccess = true;
        state.defaultAddress = action.payload;
        if (!state.currentAddress) {
          //TODO
          state.currentAddress = action.payload;
        }
      })
      .addCase(getDefaultAddress.rejected, (state, action) => {
        state.defaultAddressLoading = false;
        state.defaultAddressError = true;
        state.defaultAddressMessage = action.payload;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.deleteAddressLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.deleteAddressLoading = false;
        state.deleteAddressSuccess = true;
        state.deleteAddressMessage = action.payload;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.deleteAddressLoading = false;
        state.deleteAddressError = true;
        state.deleteAddressMessage = action.payload;
      })
      .addCase(editAddress.pending, (state) => {
        state.editAddressLoading = true;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.editAddressLoading = false;
        state.editAddressSuccess = true;
        state.addresses = action.payload;
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.editAddressLoading = false;
        state.editAddressError = true;
        state.editAddressMessage = action.payload;
      })
      .addCase(getAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.addresses = action.payload;
      })
      .addCase(getAllAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {
  reset,
  editReset,
  defaultReset,
  deleteReset,
  createReset,
  saveShippingAddress,
} = shippingSlice.actions;
export default shippingSlice.reducer;

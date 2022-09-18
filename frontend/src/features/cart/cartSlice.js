import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "./cartService";

const cartItemsFromStorage = window.sessionStorage.getItem("cartItems")
  ? JSON.parse(window.sessionStorage.getItem("cartItems"))
  : [];

const paymentMethod = localStorage.getItem("paymentMethod")
  ? JSON.parse(localStorage.getItem("paymentMethod"))
  : "";

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: [],
  paymentMethod: paymentMethod,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  deleteMessage: "",
  addToLoggedCartSuccess: false,
  addToLoggedCartLoading: false,
  deleteLoading: false,
  deleteSuccess: false,
  addToLoggedCartError: false,
};

// get all user cart items
export const getItems = createAsyncThunk(
  "cart/getItems",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    try {
      return await cartService.getItems(token);
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

// add an item to cart
export const addItem = createAsyncThunk(
  "cart/getOneItem",
  async (cartData, thunkAPI) => {
    const { id, qty } = cartData;
    try {
      return await cartService.addToCart(id, qty);
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

// edits item qty of item in cart
export const addToLoggedCart = createAsyncThunk(
  "cart/addToLoggedCart",
  async (cartData, thunkAPI) => {
    const { id, qty } = cartData;

    try {
      const token = thunkAPI.getState().auth.user.token;
      return await cartService.addToLoggedCart(token, id, qty);
    } catch (error) {
      try {
        return await cartService.addToCart(id, qty);
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
  }
);

// edits item qty of item in cart
export const editItem = createAsyncThunk(
  "cart/editOneItem",
  async (cartData, thunkAPI) => {
    const { id, qty } = cartData;
    try {
      return await cartService.editItem(id, qty);
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

// edits item qty of item in cart
export const deleteItem = createAsyncThunk(
  "cart/deleteItem",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await cartService.deleteItem(id, token);
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

// edits item qty of item in cart
export const mergeCarts = createAsyncThunk(
  "cart/mergeCarts",
  async (tempCart, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await cartService.mergeCarts(tempCart, token);
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

// edits item qty of item in cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await cartService.clearCart(token);
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

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    reset: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.addToLoggedCartSuccess = false;
      state.deleteLoading = false;
      state.deleteSuccess = false;
    },
    resetCartItems: (state) => {
      state.cartItems = [];
    },
    resetCartAddError: (state) => {
      state.addToLoggedCartError = false;
    },
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.product._id !== action.payload
      );
      window.sessionStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem(
        "ShippingAddress",
        JSON.stringify(state.shippingAddress)
      );
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem(
        "paymentMethod",
        JSON.stringify(state.paymentMethod)
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(editItem.rejected, (state, action) => {
        //  state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(editItem.pending, (state) => {
        //   state.isLoading = true;
      })
      .addCase(editItem.fulfilled, (state, action) => {
        //   state.isLoading = false;
        state.isSuccess = true;

        const item = action.payload;
        const existItem = state.cartItems.find(
          (x) => x.product === item.product
        );

        if (existItem) {
          //does not add onto the existing quantity. instead it replaces the quantity with the new quantity
          state.cartItems = state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          );
        } else {
          state.cartItems.push(item);
        }

        window.sessionStorage.setItem(
          "cartItems",
          JSON.stringify(state.cartItems)
        );
      })
      .addCase(addToLoggedCart.pending, (state) => {
        state.addToLoggedCartLoading = true;
      })
      .addCase(addToLoggedCart.fulfilled, (state, action) => {
        state.addToLoggedCartLoading = false;
        state.addToLoggedCartSuccess = true;
        if (action.payload) {
          state.cartItems = action.payload;
        } else {
          state.cartItems = [];
        }
        window.sessionStorage.setItem(
          "cartItems",
          JSON.stringify(state.cartItems)
        );
      })
      .addCase(addToLoggedCart.rejected, (state, action) => {
        state.addToLoggedCartLoading = false;
        state.isError = true;
        state.addToLoggedCartError = true;
        state.message = action.payload;
      })
      .addCase(addItem.pending, (state) => {
        state.addToLoggedCartLoading = true;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.addToLoggedCartLoading = false;
        state.addToLoggedCartSuccess = true;

        const item = action.payload;
        const existItem = state.cartItems.find(
          (x) => x.product._id == item.product._id
        );
        if (existItem) {
          let existqty = Number(item.qty);
          // adds onto the existing quantity
          //let existqty = existItem.qty;
          // existqty += item.qty;

          state.cartItems.forEach((element, index) => {
            console.log("items in cart: " + element.product._id);
            if (element.product._id == item.product._id) {
              state.cartItems[index].qty = existqty;
            }
          });
        } else {
          state.cartItems.push(item);
        }

        window.sessionStorage.setItem(
          "cartItems",
          JSON.stringify(state.cartItems)
        );
      })
      .addCase(addItem.rejected, (state, action) => {
        state.addToLoggedCartLoading = false;
        state.isError = true;
        state.addToLoggedCartError = true;
        state.message = action.payload;
      })

      .addCase(deleteItem.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.deleteSuccess = true;
        state.deleteLoading = false;
        state.deleteMessage = action.payload;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.isError = true;
        state.deleteLoading = false;
        state.deleteMessage = action.payload;
      })
      .addCase(getItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload) {
          state.cartItems = action.payload;
        } else {
          state.cartItems = [];
        }
        window.sessionStorage.setItem(
          "cartItems",
          JSON.stringify(state.cartItems)
        );
      })
      .addCase(getItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(mergeCarts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(mergeCarts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload) {
          state.cartItems = action.payload;
        } else {
          state.cartItems = [];
        }
        window.sessionStorage.setItem(
          "cartItems",
          JSON.stringify(state.cartItems)
        );
      })
      .addCase(mergeCarts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cartItems = [];
        window.sessionStorage.setItem(
          "cartItems",
          JSON.stringify(state.cartItems)
        );
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {
  reset,
  removeItem,
  saveShippingAddress,
  savePaymentMethod,
  resetCartItems,
  resetCartAddError,
} = cartSlice.actions;
export default cartSlice.reducer;

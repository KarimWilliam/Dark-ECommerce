import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./productService";

const initialState = {
  products: [],
  topProducts: [],
  homeProducts: [],
  page: 1,
  pages: 1,
  hasMore: true,
  product: "", // { reviews: [] },
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  loadingDelete: false,
  messageDelete: "",
  errorDelete: false,
  successDelete: false,
  loadingCreate: false,
  errorCreate: false,
  successCreate: false,
  messageCreate: "",
  productListError: false,
  productListMessage: "",
  productListLoading: false,
  productsList: [],
  loadingUpdate: false,
  successUpdate: false,
  messageUpdate: "",
  errorUpdate: false,
  createReviewLoading: false,
  createReviewSuccess: false,
  createReviewError: false,
  createReviewMessage: "Something went wrong. please try again later",
  topProductsLoading: false,
  topProductsSuccess: false,
  topProductsMessage: "",
  topProductsError: false,
  hideProductError: false,
  hideProductSuccess: false,
  hideProductLoading: false,
  hideProductMessage: "",
};

// listProductDetails,
export const listProductDetails = createAsyncThunk(
  "products/listProductDetails",
  async (ID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await productService.listProductDetails(ID, token);
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

// listProductDetails,
export const getTopProducts = createAsyncThunk(
  "products/getTopProducts",
  async (_, thunkAPI) => {
    try {
      return await productService.getTopProducts();
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

// createProduct,
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await productService.createProduct(token);
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

// update Product,
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (productData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await productService.updateProduct(productData, token);
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

// delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await productService.deleteProduct(id, token);
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

// list products based on a page nubmer
export const listProducts = createAsyncThunk(
  "products/listProducts",
  async (params, thunkAPI) => {
    try {
      //set this
      const { currentPage, keyword } = params;
      return await productService.listProducts(currentPage, keyword);
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

// Get products
export const getProducts = createAsyncThunk(
  "products/getAll",
  async (keyword, thunkAPI) => {
    try {
      return await productService.getProducts(keyword);
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

// Get products as an admin (include invisible products)
export const getProductsAdmin = createAsyncThunk(
  "products/getProductsAdmin",
  async (keyword, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await productService.getProductsAdmin(keyword, token);
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

// Get single product by id
export const getProduct = createAsyncThunk(
  "product/getOne",
  async (id, thunkAPI) => {
    try {
      return await productService.getProduct(id);
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

// create a product review fora product
export const createProductReview = createAsyncThunk(
  "product/createProductReview",
  async (reviewdata, thunkAPI) => {
    const { id, review } = reviewdata;
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await productService.createProductReview(id, review, token);
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

// hide a product
export const hideProduct = createAsyncThunk(
  "products/hideProduct",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await productService.hideProduct(id, token);
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

// unhide a product
export const unHideProduct = createAsyncThunk(
  "products/unHideProduct",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await productService.unHideProduct(id, token);
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

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    resetDelete: (state) => {
      state.loadingDelete = false;
      state.successDelete = false;
      state.errorDelete = false;
      state.message = "";
    },
    resetUpdate: (state) => {
      state.loadingUpdate = false;
      state.successUpdate = false;
      state.errorUpdate = false;
      state.messageUpdate = "";
    },

    createProductReset: (state) => {
      state.loadingCreate = false;
      state.successCreate = false;
      state.errorCreate = false;
      state.messageCreate = "";
      state.product = "";
    },
    createReviewReset: (state) => {
      state.createReviewError = false;
      state.createReviewLoading = false;
      state.createReviewSuccess = false;
    },
    topProductsReset: (state) => {
      state.topProductsSuccess = false;
      state.topProductsError = false;
      state.topProductsLoading = false;
    },
    hideProductsReset: (state) => {
      state.hideProductError = false;
      state.hideProductLoading = false;
      state.hideProductSuccess = false;
    },
    resetPage: (state) => {
      state.page = 1;
      state.homeProducts = [];
    },
    incPage: (state) => {
      state.page = state.page + 1;
    },
    resetHomeProducts: (state) => {
      state.homeProducts = [];
    },
    resetHasMore: (state) => {
      state.hasMore = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(listProducts.pending, (state) => {
        state.productListLoading = true;
        state.isLoading = true;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.productListLoading = false;
        state.isSuccess = true;
        state.isLoading = false;
        state.productListMessage = "success";
        state.products = action.payload.products;
        //////////////////////////////////////////////////////
        state.pages = action.payload.pages;
        state.page = action.payload.page;
        action.payload.pages > action.payload.page
          ? (state.hasMore = true)
          : (state.hasMore = false);
        state.homeProducts = [
          ...state.homeProducts,
          ...action.payload.products,
        ];
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.productListLoading = false;
        state.productListError = true;
        state.isLoading = false;
        state.productListMessage = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loadingDelete = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.messageDelete = "success";
        state.successDelete = true;
        //state.productsList = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loadingDelete = false;
        state.errorDelete = true;
        state.messageDelete = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loadingCreate = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.messageCreate = "success";
        state.product = action.payload;
        state.successCreate = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loadingCreate = false;
        state.errorCreate = true;
        state.messageCreate = action.payload;
      })
      .addCase(getProductsAdmin.pending, (state) => {
        state.productListLoading = true;
      })
      .addCase(getProductsAdmin.fulfilled, (state, action) => {
        state.productListLoading = false;
        state.isSuccess = true;
        state.products = action.payload;
      })
      .addCase(getProductsAdmin.rejected, (state, action) => {
        state.productListLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.successUpdate = true;
        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.errorUpdate = true;
        state.messageUpdate = action.payload;
      })
      .addCase(createProductReview.pending, (state) => {
        state.createReviewLoading = true;
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        state.createReviewLoading = false;
        state.createReviewSuccess = true;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.createReviewLoading = false;
        state.createReviewError = true;
        state.createReviewMessage = action.payload;
      })
      .addCase(getTopProducts.pending, (state) => {
        state.topProductsLoading = true;
      })
      .addCase(getTopProducts.fulfilled, (state, action) => {
        state.topProductsLoading = false;
        state.topProductsSuccess = true;
        state.topProducts = action.payload;
      })
      .addCase(getTopProducts.rejected, (state, action) => {
        state.topProductsLoading = false;
        state.topProductsError = true;
        state.topProductsMessage = action.payload;
      })
      .addCase(hideProduct.pending, (state) => {
        state.hideProductLoading = true;
      })
      .addCase(hideProduct.fulfilled, (state, action) => {
        state.hideProductLoading = false;
        state.hideProductSuccess = true;
        state.hideProductMessage = action.payload;
      })
      .addCase(hideProduct.rejected, (state, action) => {
        state.hideProductLoading = false;
        state.hideProductError = true;
        state.hideProductMessage = action.payload;
      })
      .addCase(unHideProduct.pending, (state) => {
        state.hideProductLoading = true;
      })
      .addCase(unHideProduct.fulfilled, (state, action) => {
        state.hideProductLoading = false;
        state.hideProductSuccess = true;
        state.hideProductMessage = action.payload;
      })
      .addCase(unHideProduct.rejected, (state, action) => {
        state.hideProductLoading = false;
        state.hideProductError = true;
        state.hideProductMessage = action.payload;
      });
  },
});

export const {
  reset,
  createProductReset,
  resetDelete,
  resetUpdate,
  createReviewReset,
  topProductsReset,
  hideProductsReset,
  resetPage,
  incPage,
  resetHomeProducts,
  resetHasMore,
} = productSlice.actions;
export default productSlice.reducer;

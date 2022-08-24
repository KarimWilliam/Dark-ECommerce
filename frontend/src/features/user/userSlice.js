import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const initialState = {
  user: null,
  users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  deleteError: false,
  deleteSuccess: false,
  updateIsLoading: false,
  updateIsSuccess: false,
  updateIsError: false,
  updateMessage: "",
};

//get User Details
export const getUserDetails = createAsyncThunk(
  "user/getUserDetails",
  async (userID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.getUserDetails(userID, token);
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

//get User Profile
export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (user, thunkAPI) => {
    try {
      return await userService.getUserProfile(user);
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

//get list of all users
export const listUsers = createAsyncThunk(
  "user/listUsers",
  async (user, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.listUsers(token);
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

//delete user by id
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.deleteUser(userID, token);
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

//update user by id
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userInfo, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.updateUser(userInfo, token);
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
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    userListReset: (state) => {
      state.users = [];
    },
    deleteReset: (state) => {
      state.deleteSuccess = false;
      state.deleteError = false;
    },
    updateReset: (state) => {
      state.updateIsLoading = false;
      state.updateIsSuccess = false;
      state.updateIsError = false;
      state.updateMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getUserDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "success";
        state.user = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "success";
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(listUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "success";
        state.users = action.payload;
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(deleteUser.pending, (state) => {
        // state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.message = "deleted user";
        state.deleteSuccess = true;
        // state.users = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        // state.isLoading = false;
        state.deleteError = true;
        state.message = action.payload;
        //  state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateIsLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateIsLoading = false;
        state.updateIsSuccess = true;
        //state.users = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateIsLoading = false;
        state.updateIsError = true;
        state.updateMessage = action.payload;
      });
  },
});

export const { reset, userListReset, deleteReset, updateReset } =
  userSlice.actions;
export default userSlice.reducer;

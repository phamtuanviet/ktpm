// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUserAPI,
  loginUserAPI,
  logoutUserAPI,
  sendVerifyOtpAPI,
  verifyEmailAPI,
  sendResetOtpAPI,
  resetPasswordAPI,
  verifyResetOtpAPI,
} from "./authService.js";

// Async action: Đăng ký người dùng
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const data = await registerUserAPI(name, email, password);
      if (!data.success) {
        return thunkAPI.rejectWithValue({
          message: data.message,
        });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async action: Đăng nhập người dùng
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await loginUserAPI(email, password);
      if (!data.success) {
        return thunkAPI.rejectWithValue({
          message: data.message,
        });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async action: Đăng xuất người dùng
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      const data = await logoutUserAPI();
      if (!data.success) {
        return thunkAPI.rejectWithValue({
          message: data.message,
        });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async action: Gửi OTP xác thực email
export const sendVerifyOtp = createAsyncThunk(
  "auth/sendVerifyOtp",
  async ({ id }, thunkAPI) => {
    try {
      const data = await sendVerifyOtpAPI(id);
      if (!data.success) {
        return thunkAPI.rejectWithValue({
          message: data.message,
        });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async action: Xác thực email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ id, otp }, thunkAPI) => {
    try {
      const data = await verifyEmailAPI(id, otp);
      if (!data.success) {
        return thunkAPI.rejectWithValue({
          message: data.message,
        });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const verifyResetOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, thunkAPI) => {
    try {
      const data = await verifyResetOtpAPI(email, otp);
      if (!data.success) {
        return thunkAPI.rejectWithValue({
          message: data.message,
        });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async action: Gửi OTP reset password
export const sendResetOtp = createAsyncThunk(
  "auth/sendResetOtp",
  async ({ email }, thunkAPI) => {
    try {
      const data = await sendResetOtpAPI(email);
      if (!data.success) {
        return thunkAPI.rejectWithValue({
          message: data.message,
        });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async action: Reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ newPassword }, thunkAPI) => {
    try {
      const data = await resetPasswordAPI(newPassword);
      if (!data.success) {
        return thunkAPI.rejectWithValue({
          success: "false",
          message: data.message,
        });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  message: null,
  isRegistered: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.user.isAccountVerified;
    },
    clearMessage(state) {
      state.message = null;
    },
    setIsRegisteredFalse(state) {
      state.isRegistered = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        state.isRegistered = true;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Register failed";
      })
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.isAuthenticated = action.payload.user.isAccountVerified;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Login failed";
      })

      // logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.message = action.payload.message;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Logout failed";
      })
      // sendVerifyOtp
      .addCase(sendVerifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendVerifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(sendVerifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Send OTP failed";
      })
      // verifyEmail
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        if (state.user) {
          state.user.isAccountVerified = true;
        }
        state.isAuthenticated = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Verification failed";
      })
      // sendResetOtp
      .addCase(sendResetOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendResetOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(sendResetOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Send reset OTP failed";
      })
      // verifyResetOtp
      .addCase(verifyResetOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyResetOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(verifyResetOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Verification failed";
      })
      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload?.message || "Reset password failed";
      });
  },
});

export const { setUser, clearMessage ,setIsRegisteredFalse  } = authSlice.actions;
export default authSlice.reducer;

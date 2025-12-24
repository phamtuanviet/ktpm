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
  authenticateWithGoogleAPI,
} from "./authService.js";

// Async action: Đăng ký người dùng
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const data = await registerUserAPI(name, email, password);
      if (!data.success) {
        return thunkAPI.rejectWithValue({
          message: data?.message || "Register failed",
        });
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const authenticateWithGoogle = createAsyncThunk(
  "auth/authenticateWithGoogleAPI",
  async ({ user }, thunkAPI) => {
    try {
      const data = await authenticateWithGoogleAPI(user);
      if (!data.success) {
        return thunkAPI.rejectWithValue({
          message: data?.message || "Authentication failed",
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
          message: data?.message || "Login failed",
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
  async ({ id }, thunkAPI) => {
    try {
      const data = await logoutUserAPI(id);
      if (!data.success) {
        return thunkAPI.rejectWithValue({
          message: data?.message || "Logout failed",
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
          message: data?.message || "Send OTP failed",
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
          message: data?.message || "Verify OTP failed",
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
          message: data?.message || "Verify OTP failed",
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
          message: data?.message || "Send OTP failed",
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
          message: data?.message || "Reset password failed",
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
  isLogin: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(user) {
      state.user = user;
    },
    setIsLogin(isLogin) {
      state.isLogin = isLogin;
    },
  },
  extraReducers: (builder) => {
    builder
      // registerUser
      .addCase(registerUser.fulfilled, (state, action) => {
        state.message = "Register successfully";
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.message = "Register failed";
      })
      // loginUser

      .addCase(loginUser.fulfilled, (state, action) => {
        state.message = "Login successfully";
        state.user = action.payload.user;
        state.isLogin = true;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.message = "Login failed";
      })

      //authenticateWithGoogleAPI
      .addCase(authenticateWithGoogle.fulfilled, (state, action) => {
        state.message = "Login successfully";
        state.user = action.payload.user;
        state.isLogin = true;
      })
      .addCase(authenticateWithGoogle.rejected, (state, action) => {
        state.message = "Login failed";
      })

      // logoutUser
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.message = "Logout successfully";
        state.user = null;
        state.isLogin = false;
        localStorage.removeItem("accessToken");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.message = "Logout failed";
      })
      // sendVerifyOtp
      .addCase(sendVerifyOtp.fulfilled, (state, action) => {
        state.message = "Send request successfully";
      })
      .addCase(sendVerifyOtp.rejected, (state, action) => {
        state.message = "Send Otp failed";
      })
      // verifyEmail
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.message = "Verify successfully";
        state.user = action.payload.user;
        state.isLogin = true;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.message = "Verify failed";
      })
      // sendResetOtp

      .addCase(sendResetOtp.fulfilled, (state, action) => {
        state.message = "Send request successfully";
      })
      .addCase(sendResetOtp.rejected, (state, action) => {
        state.message = "Send reset OTP failed";
      })
      // verifyResetOtp

      .addCase(verifyResetOtp.fulfilled, (state, action) => {
        state.isLogin = true;
        state.user = action.payload.user;
        state.message = "Verify successfully";
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(verifyResetOtp.rejected, (state, action) => {
        state.message = "Verify reset OTP failed";
      })
      // resetPassword

      .addCase(resetPassword.fulfilled, (state, action) => {
        state.message = "Reset password successfully";
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.message = "Reset password failed";
      });
  },
});

export const { setUser, setIsLogin } = authSlice.actions;
export default authSlice.reducer;

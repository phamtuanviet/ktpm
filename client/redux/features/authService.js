// services/authAPI.js
import axios from "axios";
import { setUser, setIsLogin } from "@/redux/features/authSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Tạo axios instance chung
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token (cookie tự gửi)
        const res = await axios.post(
          `${API_URL}/auth/refresh-access-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Retry request với token mới
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh cũng fail → logout hoặc redirect login
        store.dispatch(setUser(null));
        store.dispatch(setIsLogin(false));
        // Nếu refresh cũng fail → logout hoặc redirect login
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authenticateWithGoogleAPI = async (user) => {
  const response = await api.post(
    "/auth/google-login-authenticate",
    { user },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// Đăng ký người dùng
export const registerUserAPI = async (name, email, password) => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

// Đăng nhập người dùng
export const loginUserAPI = async (email, password) => {
  const response = await api.post(
    "/auth/login",
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};

// Đăng xuất người dùng
export const logoutUserAPI = async (id) => {
  const response = await api.post(
    "/auth/logout",
    { id },
    { withCredentials: true }
  );
  return response.data;
};

// Gửi OTP xác thực email
export const sendVerifyOtpAPI = async (id) => {
  const response = await api.post("/auth/resend-otp", { id });
  return response.data;
};

// Xác thực email với OTP
export const verifyEmailAPI = async (id, otp) => {
  const response = await api.post(
    "/auth/verify-email",
    { id, otp },
    { withCredentials: true }
  );
  return response.data;
};

// Gửi OTP reset password
export const sendResetOtpAPI = async (email) => {
  const response = await api.post("/auth/request-reset-password", { email });
  return response.data;
};

// Xác thực reset OTP
export const verifyResetOtpAPI = async (email, otp) => {
  const response = await api.post(
    "/auth/verify-reset-password",
    {
      email,
      otp,
    },
    { withCredentials: true }
  );
  return response.data;
};

// Reset password với OTP
export const resetPasswordAPI = async (newPassword) => {
  const response = await api.post("/auth/reset-password", { newPassword });
  return response.data;
};

// Kiểm tra xác thực (dùng token trong header)
export const checkAuthAPI = async () => {
  const response = await api.get("/auth/verify-account");
  return response.data;
};

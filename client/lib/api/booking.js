// services/api/airport.js
import axios from "axios";
import { toast } from "sonner";
import { setUser, setIsLogin } from "@/redux/features/authSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/booking";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const bookingApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

bookingApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor xử lý lỗi chung
bookingApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Token expired và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token (cookie tự gửi)
        const res = await axios.post(
          `${baseURL}/auth/refresh-access-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Retry request với token mới
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return bookingApi(originalRequest);
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

const bookingService = {
  bookingSign: async () => {
    try {
      return await bookingApi.post("/booking-sign");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  bookingVerify: async (updateData) => {
    try {
      return await bookingApi.post(`/booking-verify`, updateData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
};

export default bookingService;

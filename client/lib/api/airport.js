// services/api/airport.js
import { setUser, setIsLogin } from "@/redux/features/authSlice";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/airport";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const airportApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor xử lý lỗi chung
airportApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor xử lý lỗi chung
airportApi.interceptors.response.use(
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
        return airportApi(originalRequest);
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
const airportService = {
  getAllAirports: async () => {
    try {
      return await airportApi.get("/get-all-airports");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  getAirportById: async (id) => {
    try {
      return await airportApi.get(`/get/${id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  searchAirports: async (searchTerm) => {
    try {
      return await airportApi.get(`/airports-client/${searchTerm}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  searchAirportsInFlight: async (searchTerm, { signal } = {}) => {
    try {
      return await airportApi.get(`/airports-flight-admin/${searchTerm}`, {
        signal,
      });
    } catch (error) {
      if (error.message === "canceled") return;
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  createNewAirport: async (airportData) => {
    try {
      return await airportApi.post("/create", airportData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  updateAirport: async (id, updateData) => {
    try {
      return await airportApi.put(`/update/${id}`, updateData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  deleteAirport: async (id) => {
    try {
      return await airportApi.delete(`/delete/${id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
};

export default airportService;

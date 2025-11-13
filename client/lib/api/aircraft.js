// services/api/aircraft.js
import axios from "axios";
import { toast } from "sonner";
import { setUser, setIsLogin } from "@/redux/features/authSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/aircraft";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const aircraftApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

aircraftApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor xử lý lỗi chung
aircraftApi.interceptors.response.use(
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
        return aircraftApi(originalRequest);
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

const aircraftService = {
  getAllAircrafts: async () => {
    try {
      return await aircraftApi.get("/get-all-aircrafts");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  getAircraftById: async (id) => {
    try {
      return await aircraftApi.get(`/${id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  searchAircrafts: async (searchTerm) => {
    try {
      return await aircraftApi.get(`/search-aircrafts/${searchTerm}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
  //
  searchAircraftsInFlight: async (searchTerm, { signal } = {}) => {
    try {
      return await aircraftApi.get(`/aircrafts-flight-admin/${searchTerm}`, {
        signal,
      });
    } catch (error) {
      if (error.message === "canceled") return;
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },
  //
  getAircraftsBySearch: async (
    page,
    pageSize = 10,
    query,
    sortBy,
    sortOrder
  ) => {
    try {
      const data = await aircraftApi.get(`/aircrafts-admin`, {
        params: {
          page,
          pageSize,
          query,
          sortBy,
          sortOrder,
        },
      });
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  filterAircraft: async (filterData) => {
    try {
      filterData.page = filterData?.page || 1;
      filterData.pageSize = filterData?.pageSize || 10;
      return await aircraftApi.get("/aircrafts-filter-admin", {
        params: filterData,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  createNewAircraft: async (aircraftData) => {
    try {
      return await aircraftApi.post("/", aircraftData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  updateAircraft: async (id, updateData) => {
    try {
      return await aircraftApi.put(`/${id}`, updateData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  deleteAircraft: async (id) => {
    try {
      const data = await aircraftApi.put(`/delete`, { id });
      toast.success("Delete success");
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  countAircrafts: async () => {
    try {
      return await aircraftApi.get("/count");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
};

export default aircraftService;

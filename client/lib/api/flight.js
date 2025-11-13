import axios from "axios";
import { toast } from "sonner";
import { setUser, setIsLogin } from "@/redux/features/authSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/flight";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const flightApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

flightApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor xử lý lỗi chung
flightApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token (cookie tự gửi)
        const res = await axios.post(
          `${baseURL}/auth/refresh-access-token`,
          {}
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Retry request với token mới
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return flightApi(originalRequest);
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
const flightService = {
  getAllflight: async () => {
    try {
      return await flightApi.get("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  getLatestflight: async (skip = 0, take = 5) => {
    try {
      return await flightApi.get("/get-last", {
        params: {
          skip,
          take,
        },
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
  //
  searchFlightsInTicket: async (searchTerm, { signal } = {}) => {
    try {
      return await flightApi.get(`/flights-ticket-admin/${searchTerm}`, {
        signal,
      });
    } catch (error) {
      if (error.message === "canceled") return;
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  // searchFlightsInTicket

  //
  getFlightsBySearch: async (page, pageSize = 10, query, sortBy, sortOrder) => {
    try {
      const data = await flightApi.get(`/flights-admin`, {
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
  getFlightById: async (id) => {
    try {
      return await flightApi.get(`/${id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  filterFlights: async (filterData) => {
    try {
      filterData.page = filterData?.page || 1;
      filterData.pageSize = filterData?.pageSize || 10;
      return await flightApi.get("/flights-filter-admin", {
        params: filterData,
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  searchFlightsByUser: async (searchData) => {
    try {
      return await flightApi.get("/flights-client", {
        params: searchData,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  createFlight: async (flightData) => {
    try {
      return await flightApi.post("/", flightData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  updateFlight: async (id, updateData) => {
    try {
      return await flightApi.put(`/${id}`, updateData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  deleteFlight: async (id) => {
    try {
      const data = await flightApi.put(`/delete`, { id });
      toast.success("delete success");
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  countFlights: async () => {
    try {
      return await flightApi.get("/count");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  countStatus: async () => {
    try {
      return await flightApi.get("/count-status");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
};

export default flightService;

// services/api/airport.js
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/airport";

const airportApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor xử lý lỗi chung
airportApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
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
      return await airportApi.get(`/search-airports/${searchTerm}`, {
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  searchAirportsInFlight: async (searchTerm, { signal } = {}) => {
    try {
      return await airportApi.get(`/search-airports-in-flight/${searchTerm}`, {
        signal,
        withCredentials: true,
      });
    } catch (error) {
      if (error.message === "canceled") return;
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },


  createNewAirport: async (airportData) => {
    try {
      return await airportApi.post("/create", airportData, {
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  updateAirport: async (id, updateData) => {
    try {
      return await airportApi.put(`/update/${id}`, updateData, {
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  deleteAirport: async (id) => {
    try {
      return await airportApi.delete(
        `/delete/${id}`,
        { withCredentials: true }
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
};

export default airportService;

// services/api/aircraft.js
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/aircraft" 

const aircraftApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor xử lý lỗi chung
aircraftApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

const aircraftService = {
  getAllAircrafts: async () => {
    try {
      return await aircraftApi.get("/get-all-aircrafts", {
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  getAircraftById: async (id) => {
    try {
      return await aircraftApi.get(`/${id}`, { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  searchAircrafts: async (searchTerm) => {
    try {
      return await aircraftApi.get(`/search-aircrafts/${searchTerm}`, {
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
  //
  searchAircraftsInFlight: async (searchTerm, { signal } = {}) => {
    try {
      return await aircraftApi.get(
        `/search-aircrafts-in-flight/${searchTerm}`,
        {
          signal,
          withCredentials: true,
        }
      );
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
      const data = await aircraftApi.get(`/get-aircrafts-by-search`, {
        params: {
          page,
          pageSize,
          query,
          sortBy,
          sortOrder,
        },
        withCredentials: true,
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
      return await aircraftApi.get("/filter", {
        params: filterData,
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  createNewAircraft: async (aircraftData) => {
    try {
      return await aircraftApi.post("/", aircraftData, {
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  updateAircraft: async (id, updateData) => {
    try {
      return await aircraftApi.put(`/${id}`, updateData, {
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  deleteAircraft: async (id) => {
    try {
      const data = await aircraftApi.delete(`/${id}`, {
        withCredentials: true,
      });
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
      return await aircraftApi.get("/count-aircrafts", {
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
};

export default aircraftService;

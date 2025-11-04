import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/flight";

const flightApi = axios.create({
  baseURL: API_BASE_URL,
});

flightApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

const flightService = {
  getAllflight: async () => {
    try {
      return await flightApi.get("/", { withCredentials: true });
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
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
  //
  searchFlightsInTicket: async (searchTerm, { signal } = {}) => {
    try {
      return await flightApi.get(`/search-flights-in-ticket/${searchTerm}`, {
        signal,
        withCredentials: true,
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
      const data = await flightApi.get(`/get-flights-by-search`, {
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
  getFlightById: async (id) => {
    try {
      return await flightApi.get(`/${id}`, { withCredentials: true });
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
      return await flightApi.get("/filter", {
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
      return await flightApi.get("/search-flights-by-user", {
        params: searchData,
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  createFlight: async (flightData) => {
    try {
      return await flightApi.post("/", flightData, { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  updateFlight: async (id, updateData) => {
    try {
      return await flightApi.put(`/${id}`, updateData, { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  deleteFlight: async (id) => {
    try {
      const data = await flightApi.delete(`/${id}`, { withCredentials: true });
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
      return await flightApi.get("/count-flights", { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  countStatus: async () => {
    try {
      return await flightApi.get("/count-status", { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
};

export default flightService;

import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/ticket";

const ticketApi = axios.create({
  baseURL: API_BASE_URL,
});

ticketApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

const ticketService = {
  getAllTicket: async () => {
    try {
      return await ticketApi.get("/", { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  getLatestTicket: async (skip = 0, take = 5) => {
    try {
      return await ticketApi.get("/get-last", {
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
  filterTickets: async (filterData) => {
    try {
      filterData.page = filterData?.page || 1;
      filterData.pageSize = filterData?.pageSize || 10;
      return await ticketApi.get("/filter", {
        params: filterData,
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  getTicketsBySearch: async (page, pageSize = 10, query, sortBy, sortOrder) => {
    try {
      const data = await ticketApi.get(`/get-tickets-by-search`, {
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
  getTicketById: async (id) => {
    try {
      return await ticketApi.get(`/${id}`, { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  createTicket: async (ticketData) => {
    try {
      return await ticketApi.post("/", ticketData, { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  createTicketClient: async (ticketData) => {
    try {
      return await ticketApi.post("/ticket-client", ticketData, {
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  
  updateTicket: async (id, updateData) => {
    try {
      return await ticketApi.put(`/${id}`, updateData, {
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  cancelTicket: async (data) => {
    try {
      const res = await ticketApi.put(`/cancel`, data, {
        withCredentials: true,
      });
      toast.success("Cancel successfully");
      return res;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  deleteTicket: async (id) => {
    try {
      const data = await ticketApi.delete(`/${id}`, { withCredentials: true });
      toast.success("delete success");
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
  //
  lookUpTicket: async (search = "") => {
    try {
      const res = await ticketApi.get(`/look-up/${search}`, {
        withCredentials: true,
      });
      return res;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  countAllTicket: async () => {
    try {
      const res = await ticketApi.get("/count-all-ticket", {
        withCredentials: true,
      });
      return res;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  countCancelledTicket: async () => {
    try {
      const res = await ticketApi.get("/count-cancelled-ticket", {
        withCredentials: true,
      });
      return res;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  //
  countTicketStats: async (status) => {
    try {
      const res = await ticketApi.get("count-ticket-stats", {
        withCredentials: true,
      });
      return res;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
};

export default ticketService;

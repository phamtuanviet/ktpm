// services/api/user.js
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/user";

const userApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

userApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

const userService = {
  getAllusers: async () => {
    try {
      return await userApi.get("/get-all-users");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  getUserById: async (id) => {
    try {
      return await userApi.get(`/${id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  filterUsers: async (filterData) => {
    try {
      filterData.page = filterData?.page || 1;
      filterData.pageSize = filterData?.pageSize || 10;
      return await userApi.get("/filter", {
        params: filterData,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  getUserBySearch: async (page, pageSize = 10, query, sortBy, sortOrder) => {
    try {
      const data = await userApi.get(`/get-users-by-search`, {
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

  countUsers: async () => {
    try {
      return await userApi.get("/count-users", { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  searchUsers: async (searchTerm) => {
    try {
      return await userApi.get(`/search-users/${searchTerm}`, {
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  createNewuser: async (userData) => {
    try {
      return await userApi.post("/create", userData, { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  updateUser: async (id, updateData) => {
    try {
      return await userApi.put(`/update/${id}`, updateData, {
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  deleteuser: async (id) => {
    try {
      return await userApi.delete(`/delete/${id}`, { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
};

export default userService;

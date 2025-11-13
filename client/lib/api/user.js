// services/api/user.js
import axios from "axios";
import { toast } from "sonner";
import { setUser, setIsLogin } from "@/redux/features/authSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/user";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const userApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

userApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor xử lý lỗi chung
userApi.interceptors.response.use(
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
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Retry request với token mới
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return userApi(originalRequest);
      } catch (refreshError) {
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
      return await userApi.get("/user-filter-admin", {
        params: filterData,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  getUserBySearch: async (page, pageSize = 10, query, sortBy, sortOrder) => {
    try {
      const data = await userApi.get(`/user-admin`, {
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

  countUsers: async () => {
    try {
      return await userApi.get("/count");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  searchUsers: async (searchTerm) => {
    try {
      return await userApi.get(`/search-users/${searchTerm}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  updateUser: async (id, updateData) => {
    try {
      return await userApi.put(`/${id}`, updateData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  deleteuser: async (id) => {
    try {
      return await userApi.delete(`/delete/${id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
};

export default userService;

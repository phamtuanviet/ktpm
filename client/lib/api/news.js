import axios from "axios";
import { toast } from "sonner";
import { setUser, setIsLogin } from "@/redux/features/authSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/news";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const newsApi = axios.create({
  baseURL: API_BASE_URL,
});

newsApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor xử lý lỗi chung
newsApi.interceptors.response.use(
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
        return newsApi(originalRequest);
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

const newsService = {
  getAllNews: async () => {
    try {
      return await newsApi.get("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  getLatestNews: async (skip = 0, take = 5) => {
    try {
      return await newsApi.get("/get-lastest", {
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

  getNewsBySearch: async (page, pageSize = 10, query, sortBy, sortOrder) => {
    try {
      const data = await newsApi.get(`/news-admin`, {
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

  getNewsById: async (id) => {
    try {
      return await newsApi.get(`/${id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  createNews: async (newsData) => {
    try {
      return await newsApi.post("/", newsData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  updateNews: async (id, updateData) => {
    try {
      return await newsApi.put(`/${id}`, updateData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  filterNews: async (filterData) => {
    try {
      filterData.page = filterData?.page || 1;
      filterData.pageSize = filterData?.pageSize || 10;
      return await newsApi.get("/news-filter-admin", {
        params: filterData,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  deleteNews: async (id) => {
    try {
      const data = await newsApi.put(`/delete`, { id });
      toast.success("delete success");
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  countNews: async () => {
    try {
      return await newsApi.get("/count-news");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
};

export default newsService;

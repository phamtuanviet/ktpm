import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/news";

const newsApi = axios.create({
  baseURL: API_BASE_URL,
});

newsApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

const newsService = {
  getAllNews: async () => {
    try {
      return await newsApi.get("/", { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  getLatestNews: async (skip = 0, take = 5) => {
    try {
      return await newsApi.get("/get-last", {
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

  getNewsBySearch: async (page, pageSize = 10, query, sortBy, sortOrder) => {
    try {
      const data = await newsApi.get(`/get-news-by-search`, {
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

  getNewsById: async (id) => {
    try {
      return await newsApi.get(`/${id}`, { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  createNews: async (newsData) => {
    try {
      return await newsApi.post("/", newsData, { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  updateNews: async (id, updateData) => {
    try {
      return await newsApi.put(`/${id}`, updateData, { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  filterNews: async (filterData) => {
    try {
      filterData.page = filterData?.page || 1;
      filterData.pageSize = filterData?.pageSize || 10;
      return await newsApi.get("/filter", {
        params: filterData,
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  deleteNews: async (id) => {
    try {
      const data = await newsApi.delete(`/${id}`, { withCredentials: true });
      toast.success("delete success");
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },

  countNews: async () => {
    try {
      return await newsApi.get("/count-news", { withCredentials: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return null;
    }
  },
};

export default newsService;

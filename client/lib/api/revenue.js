// import axios from 'axios';
// import { toast } from 'sonner';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/revenue';

// const revenueApi = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Interceptor xử lý lỗi chung
// revenueApi.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// const revenueService = {
//   getRevenue: async () => {
//     try {
//       return await revenueApi.get('/get-revenue',{      withCredentials: true,});
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Something went wrong');
//       return null;
//     }
//   },
// };

// export default revenueService;
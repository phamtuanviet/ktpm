import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Hàm đăng nhập
// services/authAPI.js

// Đăng ký người dùng
export const registerUserAPI = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password,
  },{ withCredentials: true });
  return response.data;
};
// Đăng nhập người dùng
export const loginUserAPI = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  },{ withCredentials: true });
  return response.data;
};

// Đăng xuất người dùng
export const logoutUserAPI = async () => {
  const response = await axios.post(`${API_URL}/auth/logout`,{},{ withCredentials: true });
  return response.data;
};

// Gửi OTP xác thực email
export const sendVerifyOtpAPI = async (id) => {
    const response = await axios.post(`${API_URL}/auth/send-verify-otp`, {
      id,
    });
  return response.data;
};

// Xác thực email với OTP
export const verifyEmailAPI = async (id, otp) => {
  const response = await axios.post(`${API_URL}/auth/verify-account`, { id, otp }, { withCredentials: true });
  return response.data;
};

// Gửi OTP reset password
export const sendResetOtpAPI = async (email) => {
  const response = await axios.post(`${API_URL}/auth/send-reset-otp`, {
    email,
  });
  return response.data;
};

// Xác thực reset OTP 
export const verifyResetOtpAPI = async (email, otp) => {
  const response = await axios.post(`${API_URL}/auth/verify-reset-otp`, {
    email,
    otp
  },{ withCredentials: true });
  return response.data;
};

// Reset password với OTP
export const resetPasswordAPI = async (newPassword) => {
  const response = await axios.post(`${API_URL}/auth/reset-password`, {
    newPassword,
  } ,{ withCredentials: true });
  return response.data;
};

// Kiểm tra xác thực
/*export const checkAuthAPI = async () => {
  const response = await axios.get(`${API_URL}/auth/verify-account`);
  return response.data;
};*/

import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:7278/api",
  timeout: 10000,
});

// Attach JWT token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ApiResponse<T> envelope
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.title ||
      err.message ||
      "Something went wrong.";
    return Promise.reject(new Error(message));
  }
);

export default API;
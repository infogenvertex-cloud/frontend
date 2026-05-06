import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "https://backend-gamma-seven-22.vercel.app";
const sanitizedApiUrl = rawApiUrl.trim().replace(/^['"`]+|['"`]+$/g, "");

const api = axios.create({
  baseURL: sanitizedApiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

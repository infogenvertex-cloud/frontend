import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "https://backend-gamma-seven-22.vercel.app";
const sanitizedApiUrl = rawApiUrl.trim().replace(/^['"`]+|['"`]+$/g, "");

console.log("🔧 Axios Configuration:");
console.log("  Raw API URL:", rawApiUrl);
console.log("  Sanitized API URL:", sanitizedApiUrl);
console.log("  Environment:", import.meta.env.MODE);

const api = axios.create({
  baseURL: sanitizedApiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("📤 API Request:", {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
    hasToken: !!token,
    timestamp: new Date().toISOString()
  });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      dataKeys: Object.keys(response.data || {}),
      timestamp: new Date().toISOString()
    });
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    });
    
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      console.warn("🔒 Authentication failed, redirecting to login");
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

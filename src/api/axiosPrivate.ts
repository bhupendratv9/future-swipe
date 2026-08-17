import axios from "axios";

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add token from localStorage to every request
axiosPrivate.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["X-Access-Token"] = token;
  }
  return config;
});

export default axiosPrivate;
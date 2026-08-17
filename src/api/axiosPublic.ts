import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  validateStatus: (status) => status < 500
});

export default axiosPublic;
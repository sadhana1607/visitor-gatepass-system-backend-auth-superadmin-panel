import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:9092/api",
  withCredentials: true,
});

// 👉 Attach JWT automatically to every request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;
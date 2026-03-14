import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// 🔑 Automatically attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or whatever key you stored it with

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
//   withCredentials: true, // if you need cookies
});

export default api;

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      
      console.error("API Error:", error.response.data.message || error.message);
    } else {
      console.error("API Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default API;

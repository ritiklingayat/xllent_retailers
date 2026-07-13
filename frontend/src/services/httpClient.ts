import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL?.trim() || "http://localhost:8082";

export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
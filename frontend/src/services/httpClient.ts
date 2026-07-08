import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL?.trim();

export const httpClient = axios.create({
  baseURL: apiBaseUrl || undefined,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 15000
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

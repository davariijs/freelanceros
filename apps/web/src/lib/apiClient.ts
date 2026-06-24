import axios from "axios";
import { WebLogger } from "@/utils/logger";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    WebLogger.info(
      `Outbound Request: [${config.method?.toUpperCase()}] ${config.url}`,
      config.data,
    );

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    WebLogger.error("Request Interception Failed", error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    WebLogger.info(
      `Inbound Response: [${response.status}] ${response.config.url}`,
      response.data,
    );
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    WebLogger.error(
      `API Error Intercepted: [${status || "NETWORK_ERROR"}] ${message}`,
      error,
    );
    return Promise.reject(error);
  },
);

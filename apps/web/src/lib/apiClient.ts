import axios from "axios";
import { WebLogger } from "@/utils/logger";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const isDev = process.env.NODE_ENV !== "production";

apiClient.interceptors.request.use(
  (config) => {
    if (isDev) {
      WebLogger.info(
        `Outbound Request: [${config.method?.toUpperCase()}] ${config.url}`,
        config.data,
      );
    }

    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (isDev) {
      WebLogger.info(
        `Inbound Response: [${response.status}] ${response.config.url}`,
        response.data,
      );
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    WebLogger.error(
      `API Error Intercepted: [${status || "NETWORK_ERROR"}] ${message}`,
      error,
    );

    if (status === 401 && typeof window !== "undefined") {
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure";
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

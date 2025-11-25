import { useAuthStore } from "@/store/auth-store";
import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from "axios";

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string | null) => void;
  reject: (err: Error) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    // Endpoints that should NOT trigger token refresh on 401/403
    // IMPORTANT: /api/v1/auth/refresh MUST be here to prevent infinite loop
    // when the refresh token itself is expired
    const unauthenticatedEndpoints = [
      "/api/v1/auth/login",
      "/api/v1/auth/signup",
      "/api/v1/auth/verify-otp",
      "/api/v1/auth/login-vendor",
      "/api/v1/auth/signup-vendor",
      "/api/v1/auth/forgot-password/request",
      "/api/v1/auth/forgot-password/confirm",
      "/api/v1/auth/refresh",
      "/api/v1/auth/logout",
    ];

    const isUnauthEndpoint = unauthenticatedEndpoints.some((ep) =>
      originalRequest?.url?.endsWith(ep)
    );

    // If request doesn't have token yet or is an auth endpoint, don't try refresh.
    if (isUnauthEndpoint || !useAuthStore.getState().accessToken) {
      return Promise.reject(error);
    }

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest?._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (originalRequest.headers) {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        api
          .post("/api/v1/auth/refresh")
          .then(({ data }) => {
            const newToken = data.data?.accessToken as string;
            if (newToken) {
              useAuthStore.getState().setAccessToken(newToken);
              api.defaults.headers.common["Authorization"] =
                `Bearer ${newToken}`;
            }
            processQueue(null, newToken);
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            }
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            useAuthStore.getState().logout();
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",

  withCredentials: true,
});

const PROTECTED_ROUTE_PREFIXES = [
  "/home",
  "/consultations",
  "/shop",
  "/profile",
  "/chat",
  "/call",
  "/orders",
  "/checkout",
];

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

let isRefreshing = false;

let refreshSubscribers: Array<(success: boolean) => void> = [];

function subscribeToRefresh(callback: (success: boolean) => void) {
  refreshSubscribers.push(callback);
}

function notifyRefreshSubscribers(success: boolean) {
  refreshSubscribers.forEach((callback) => callback(success));

  refreshSubscribers = [];
}

api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      typeof window === "undefined"
    ) {
      return Promise.reject(error);
    }

    const pathname = window.location.pathname;

    if (originalRequest.url?.includes("/auth/logout")) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh-token")) {
      handleUnauthorized(pathname);

      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      handleUnauthorized(pathname);

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeToRefresh((success) => {
          if (!success) {
            reject(error);
            return;
          }

          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      console.log("Access token expired. Refreshing...");

      await axios.post(
        `${api.defaults.baseURL}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        },
      );

      console.log("Token refreshed successfully");

      notifyRefreshSubscribers(true);

      return api(originalRequest);
    } catch (refreshError) {
      console.error("Refresh token failed:", refreshError);

      notifyRefreshSubscribers(false);

      handleUnauthorized(pathname);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

function handleUnauthorized(pathname: string) {
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    console.warn("Admin session expired");

    localStorage.removeItem("hasSession");

    window.location.href = "/admin/login";

    return;
  }

  if (isProtectedRoute(pathname) && !pathname.startsWith("/admin")) {
    console.warn("User session expired");

    localStorage.removeItem("hasSession");

    window.location.href = "/home";

    return;
  }
}

export default api;

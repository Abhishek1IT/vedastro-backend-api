import axios from "axios";

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
  "/admin",
];

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const pathname = window.location.pathname;

      if (isProtectedRoute(pathname) && pathname !== "/login") {
        console.warn("Unauthorized. Redirecting to login...");

        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  },
);

export default api;

import axios from "axios";

const IS_DEV = process.env.NODE_ENV === "development";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 60000,
});

// ── Request interceptor ─────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }
    if (IS_DEV) console.log("🚀 [API Request]", config);
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ────────────────────────────
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

apiClient.interceptors.response.use(
  (response) => {
    if (IS_DEV) console.log("✅ [API Response]", response);
    return response;
  },
  async (error) => {
    const config = error.config;
    const isTimeout = error.code === "ECONNABORTED" || error.message?.includes("timeout");
    const isNetworkError = error.code === "ERR_NETWORK" || !error.response;

    if ((isTimeout || isNetworkError) && config) {
      config._retryCount = config._retryCount ?? 0;
      if (config._retryCount < MAX_RETRIES) {
        config._retryCount += 1;
        await sleep(RETRY_DELAY_MS);
        return apiClient(config);
      }
    }

    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
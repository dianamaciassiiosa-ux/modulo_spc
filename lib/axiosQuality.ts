import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { devWarn } from "./logger";


const MAX_RETRIES = 3;
const BASE_DELAY_MS = 4_000;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
}

const getExternalBaseURL = () => {
  return "/api/proxy/quality";
};

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const isTimeoutError = (error: AxiosError) => error.code === "ECONNABORTED";

const isNetworkError = (error: AxiosError) =>
  !error.response && Boolean(error.code);

const isRetryable = (error: AxiosError): boolean => {
  if (isTimeoutError(error)) return true;
  if (isNetworkError(error)) return true;
  if (error.response && RETRYABLE_STATUS.has(error.response.status)) return true;
  return false;
};

const qualityApi = axios.create({
  baseURL: getExternalBaseURL(),
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

qualityApi.interceptors.request.use((config) => {
  const isBrowser = typeof window !== "undefined";

  if (!isBrowser) return config;

  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith("mes_station_key="));
  const stationKey = match?.split("=")[1];

  if (stationKey) {
    config.headers["X-Station-Key"] = decodeURIComponent(stationKey);
  }

  if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});

qualityApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;

    if (config && isRetryable(error)) {
      config._retryCount = config._retryCount ?? 0;

      if (config._retryCount < MAX_RETRIES) {
        config._retryCount += 1;

        const delay = BASE_DELAY_MS * Math.pow(2, config._retryCount - 1);

        const reason = error.response
          ? `HTTP ${error.response.status}`
          : `Network Error (${error.code})`;

        devWarn(
          `[QUALITY API] Retry ${config._retryCount}/${MAX_RETRIES} — ${reason} — ` +
            `${config.method?.toUpperCase()} ${config.url} — waiting ${delay}ms`
        );

        await sleep(delay);

        return qualityApi.request(config);
      }

      console.error(
        `[QUALITY API] All ${MAX_RETRIES} retries exhausted — ` +
          `${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return Promise.reject(error);
  }
);

export default qualityApi;
export { AxiosError } from "axios";
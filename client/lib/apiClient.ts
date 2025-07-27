import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { getNewToken, logout } from "../utils/auth";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

class ApiClient {
  private isRefreshing = false;
  private failedQueue: any[] = [];

  private client = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  constructor() {
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return this.client(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await getNewToken();
            this.client.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            this.processQueue(null, newToken);
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            toast.error("Session expired. Please log in again.");
            logout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((prom) =>
      error ? prom.reject(error) : prom.resolve(token)
    );
    this.failedQueue = [];
  }

  private async handleResponse<T>(
    promise: Promise<AxiosResponse<T>>
  ): Promise<T> {
    try {
      const res = await promise;
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const status = err.response?.status;
      const message =
        err.response?.data?.message || err.message || "Unknown error occurred";

      console.error("🔴 API Error:", message, "| Status:", status);

      // You can optionally toast here if not already shown
      if (status !== 401) {
        toast.error(message);
      }

      throw new Error(message);
    }
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.handleResponse<T>(this.client.get(url, config));
  }
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.handleResponse<T>(this.client.post(url, data, config));
  }
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.handleResponse<T>(this.client.put(url, data, config));
  }
  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.handleResponse<T>(this.client.patch(url, data, config));
  }
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.handleResponse<T>(this.client.delete(url, config));
  }
}

export const apiClient = new ApiClient();

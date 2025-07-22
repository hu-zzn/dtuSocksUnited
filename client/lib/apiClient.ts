import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

class ApiClient {
  private client = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 👈 essential for sending/receiving cookies (JWT)
    headers: {
      "Content-Type": "application/json",
    },
  });


  private async handleResponse<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
    try {
      const res = await promise;
      return res.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unknown error occurred";

      console.error("🔴 API Error:", message, "| Status:", status);

      // Optional: handle unauthorized globally
      if (status === 401) {
        console.warn("🛑 Unauthorized: Maybe cookies are missing or expired");
        // You can also redirect to login or trigger logout here
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
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"
  withCredentials: true, // ✅ this sends the cookie
});
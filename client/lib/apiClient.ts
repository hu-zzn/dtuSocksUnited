import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

class ApiClient {
  private client = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 👈 essential for sending/receiving cookies (JWT)
    headers: {
      "Content-Type": "application/json",
    },
  });

  private handleResponse<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
    return promise.then(res => res.data).catch(error => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unknown error occurred";
      console.error("🔴 API Error:", message);
      throw new Error(message);
    });
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
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true, // ✅ this sends the cookie
});
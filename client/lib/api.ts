const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = localStorage.getItem("token")

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint)
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    })
  }
}

const apiClient = new ApiClient(API_BASE_URL)

export const authApi = {
  register: (data: { name: string; email: string; password: string }) => apiClient.post("/auth/register", data),

  verifyOTP: (email: string, otp: string) => apiClient.post("/auth/verify-otp", { email, otp }),

  resendOTP: (email: string) => apiClient.post("/auth/resend-otp", { email }),

  login: (email: string, password: string) => apiClient.post("/auth/login", { email, password }),

  logout: () => apiClient.get("/auth/logout"),

  getMe: () => apiClient.get("/auth/me"),

  forgotPassword: (email: string) => apiClient.post("/auth/password/forgot", { email }),

  resetPassword: (token: string, password: string) => apiClient.post(`/auth/password/reset/${token}`, { password }),

  updatePassword: (currentPassword: string, newPassword: string) =>
    apiClient.patch("/auth/password/update", { currentPassword, newPassword }),
}

export const societyApi = {
  getAll: () => apiClient.get("/soc/all"),

  add: (data: any) => apiClient.post("/soc/admin/add", data),

  update: (id: string, data: any) => apiClient.patch(`/soc/update/${id}`, data),

  delete: (id: string) => apiClient.delete(`/soc/delete/${id}`),
}

export const cartApi = {
  getCart: () => apiClient.get("/cart/show"),

  toggleCart: (societyId: string) => apiClient.post("/cart/toggle", { societyId }),
}

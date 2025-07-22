// client/lib/apis.ts

import { apiClient } from "./apiClient";
import { User, LoginResponse, GenericResponse, Society } from "../types";

// AUTH API
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<GenericResponse>("/auth/register", data),

  verifyOTP: (email: string, otp: string) =>
    apiClient.post<LoginResponse>("/auth/verify-otp", { email, otp }),

  resendOTP: (email: string) => apiClient.post<GenericResponse>("/auth/resend-otp", { email }),

  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>("/auth/login", { email, password }),

  logout: () => apiClient.get<GenericResponse>("/auth/logout"),

  getMe: () => apiClient.get<{ success: boolean; user: User }>("/auth/me"),

  forgotPassword: (email: string) =>
    apiClient.post<GenericResponse>("/auth/password/forgot", { email }),

  resetPassword: (token: string, password: string, confirmPassword: string) =>
    apiClient.put<GenericResponse>(`/auth/reset-password/${token}`, {
      password,
      confirmPassword,
    }),

  updatePassword: (currentPassword: string, newPassword: string, confirmNewPassword: string) =>
    apiClient.patch<GenericResponse>("/auth/password/update", {
      currentPassword,
      newPassword,
      confirmNewPassword,
    }),
};

// SOCIETY API
export const societyApi = {
  getAll: () =>
    apiClient.get<{ success: boolean; socs: Society[] }>("/soc/all"),

  add: (data: Partial<Society>) =>
    apiClient.post<{ success: boolean; message: string; soc: Society }>("/soc/admin/add", data),

  update: (id: string, data: Partial<Society>) =>
    apiClient.patch<{ success: boolean; message: string; soc: Society }>(
      `/soc/admin/update/${id}`,
      data
    ),

  delete: (id: string) =>
    apiClient.delete<{ success: boolean; message: string }>(`/soc/admin/delete/${id}`),
};

// CART API
export const cartApi = {
  getCart: () =>
    apiClient.get<{ success: boolean; cart: Society[] }>("/cart/show"),

  toggleCart: (socId: string) =>
    apiClient.post<{ success: boolean; message: string }>("/cart/toggle", { socId }),
};

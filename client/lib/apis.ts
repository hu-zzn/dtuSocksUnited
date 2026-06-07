// client/lib/apis.ts
import { apiClient } from "./apiClient";
import { User, LoginResponse, GenericResponse, Society } from "../types";

// AUTH API
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post<GenericResponse>("/api/auth/register", data),
  verifyOTP: (email: string, otp: string) =>
    apiClient.post<LoginResponse>("/api/auth/verify-otp", { email, otp }),
  resendOTP: (email: string) =>
    apiClient.post<GenericResponse>("/api/auth/resend-otp", { email }),
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>("/api/auth/login", { email, password }),
  logout: () => apiClient.get<GenericResponse>("/api/auth/logout"),
  getMe: () => apiClient.get<{ success: boolean; user: User }>("/api/auth/me"),
  forgotPassword: (email: string) =>
    apiClient.post<GenericResponse>("/api/auth/password/forgot", { email }),
  resetPassword: (token: string, password: string, confirmPassword: string) =>
    apiClient.put<GenericResponse>(`/api/auth/reset-password/${token}`, { password, confirmPassword }),
  updatePassword: (currentPassword: string, newPassword: string, confirmNewPassword: string) =>
    apiClient.patch<GenericResponse>("/api/auth/password/update", {
      currentPassword,
      newPassword,
      confirmNewPassword,
    }),
};

// SOCIETY API
export const societyApi = {
  getAll: () => apiClient.get<{ success: boolean; socs: Society[] }>("/api/soc/all"),
  managed: () =>
    apiClient.get<{ success: boolean; socs: Society[] }>("/api/soc/managed"),
  getForEdit: (id: string) =>
    apiClient.get<{ success: boolean; soc: Society }>(`/api/soc/edit/${id}`),
  add: (data: Partial<Society>) =>
    apiClient.post<{ success: boolean; message: string; soc: Society }>("/api/soc/admin/add", data),
  update: (id: string, data: Partial<Society>) =>
    apiClient.patch<{ success: boolean; message: string; soc: Society }>(
      `/api/soc/admin/update/${id}`, data),
  delete: (id: string) =>
    apiClient.delete<{ success: boolean; message: string }>(`/api/soc/admin/delete/${id}`),
  edit: (
    id: string,
    data: Partial<Pick<Society, "socAbout" | "socHighlights" | "socKeyEvents" | "socContact">>
  ) =>
    apiClient.patch<{ success: boolean; message: string; soc: Society }>(
      `/api/soc/edit/${id}`,
      data
    ),
  transferAdmin: (id: string, data: { newAdminEmail?: string; newAdminId?: string }) =>
    apiClient.post<{ success: boolean; message: string; soc: Society }>(
      `/api/soc/transfer/${id}`,
      data
    ),
};

// CART API
export const cartApi = {
  getCart: () => apiClient.get<{ success: boolean; cart: Society[] }>("/api/cart/show"),
  toggleCart: (socId: string) =>
    apiClient.post<{ success: boolean; message: string }>("/api/cart/toggle", { socId }),
};

import axios from "axios";

export const getNewToken = async (): Promise<string> => {
  const res = await axios.get("/api/v1/auth/refresh-token", {
    withCredentials: true,
  });
  return res.data.token;
};

export const logout = () => {
  localStorage.removeItem("token"); // optional
  window.location.href = "/login";  // force redirect
};

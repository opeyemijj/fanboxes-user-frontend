import http from "../http";

export const register = async (payload) => {
  const { data } = await http.post(`/auth/register`, payload);
  return data;
};
export const verifyOTP = async (payload) => {
  const { data } = await http.post(`/auth/verify-otp`, payload);
  return data;
};
export const resendOTP = async (payload) => {
  const { data } = await http.post(`/auth/resend-otp`, payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await http.post(`/auth/login`, payload);
  return data;
};

export const forgetPassword = async (payload) => {
  const { data } = await http.post("/auth/forget-password", payload);
  return data;
};

export const resetPassword = async ({ newPassword, token }) => {
  const { data } = await http.post("/auth/reset-password", {
    newPassword: newPassword,
    token: token,
  });
  return data;
};

export const verifyLoggedInUserToken = async () => {
  const { data } = await http.get("/auth/verify-token");
  return data;
};

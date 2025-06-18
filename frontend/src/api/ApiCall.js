import axiosInstance from "./axiosInstance";


export const loginUserApi = (credentials) => {
  return axiosInstance.post("/auth/login", credentials);
};

export const registerUserApi = (data) => {
  return axiosInstance.post("/auth/register", data);
};
export const getUserProfile = () => {
  return axiosInstance.get("/profile/me");
};

export const updateProfile = (data) => {
  return axiosInstance.put("/profile/update", data);
};

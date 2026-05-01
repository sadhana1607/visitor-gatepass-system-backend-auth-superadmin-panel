import axiosClient from "./axiosClient";

export const loginUser = (data) => {
  return axiosClient.post("/auth/login", data);
};

export const logoutUser = () => {
  return axiosClient.post("/auth/logout");
};
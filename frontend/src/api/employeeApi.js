import axiosClient from "./axiosClient";

// CREATE
export const createEmployee = (data) => {
  return axiosClient.post("/employee/create", data);
};

// GET ALL
export const getAllEmployees = () => {
  return axiosClient.get("/employee/all");
};

// GET BY ID
export const getEmployeeById = (id) => {
  return axiosClient.get(`/employee/${id}`);
};

// UPDATE
export const updateEmployee = (id, data) => {
  return axiosClient.put(`/employee/update/${id}`, data);
};

// UPDATE STATUS
export const updateEmployeeStatus = (id, status) => {
  return axiosClient.put(`/employee/status/${id}`, { status });
};
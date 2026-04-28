import API from "./axiosClient";

// ✅ FIXED URL
export const getAllOrganizations = () => {
  return API.get("/org/all");
};

// CREATE
export const createOrganization = (data) => {
  return API.post("/org-req/create", data);
};

// UPDATE
export const updateOrganization = (id, data) => {
  return API.put(`/org/update/${id}`, data);
};

// APPROVE
export const approveOrganization = (id) => {
  return API.put(`/org/approve/${id}`);
};

// REJECT
export const rejectOrganization = (id) => {
  return API.put(`/org/reject/${id}`);
};
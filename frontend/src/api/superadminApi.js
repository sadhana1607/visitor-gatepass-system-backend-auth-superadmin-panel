import axios from "axios";

const BASE_URL = "http://localhost:2021/api/superadmin";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true //
});

//GET ALL
export const getAllOrganizations = () => api.get("/all-orgs");

//DELETE
export const deleteOrganization = (id) => api.delete(`/del-org/${id}`);

//APPROVE
export const approveOrganization = (id) => api.put(`/approve/${id}`);

//REJECT
export const rejectOrganization = (id) => api.put(`/reject/${id}`);
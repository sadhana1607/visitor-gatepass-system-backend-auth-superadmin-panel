import axios from "axios";

export const RegisterOrg = (data) => {
  return axios.post("http://localhost:8080/api/org-req/create", data);
};
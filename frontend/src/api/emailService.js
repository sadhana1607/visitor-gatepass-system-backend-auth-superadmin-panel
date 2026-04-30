import API from "./axiosClient";

// ✅ SEND EMAIL
export const sendEmailApi = (data) => {
  return API.post("/email/send", data);
};

// ✅ GET ALL EMAILS
export const getInboxEmailsApi = () => {
  return API.get("/email/inbox");
};

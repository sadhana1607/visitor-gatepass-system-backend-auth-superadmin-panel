import API from "./axiosClient";

export const sendEmailApi = (data) => API.post("/email/send", data);
export const getInboxEmailsApi = () => API.get("/email/inbox");
export const getSentEmailsApi = () => API.get("/email/sent");  // ✅ NEW
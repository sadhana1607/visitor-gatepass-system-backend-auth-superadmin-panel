import axiosClient from "./axiosClient";

// ✅ GET ALL ALERTS (with filters)
export const getAllAlerts = (params = {}) => {
  // params = { org, type, status }
  return axiosClient.get("/alerts/all_alerts", { params });
};

// ✅ GET ALERT STATS
export const getAlertStats = () => {
  return axiosClient.get("/alerts/stats");
};

// ✅ GET ORGANIZATIONS
export const getAlertOrgs = () => {
  return axiosClient.get("/alerts/orgs");
};

// ✅ GET ALERT BY ID
export const getAlertById = (id) => {
  return axiosClient.get(`/alerts/${id}`);
};

// ✅ CREATE ALERT
export const createAlert = (data) => {
  return axiosClient.post("/alerts", data);
};

// ✅ ACKNOWLEDGE ALERT
export const acknowledgeAlert = (id) => {
  return axiosClient.patch(`/alerts/${id}/acknowledge`);
};

// ✅ RESOLVE ALERT
export const resolveAlert = (id) => {
  return axiosClient.patch(`/alerts/${id}/resolve`);
};

// ✅ ESCALATE ALERT
export const escalateAlert = (id, action = null) => {
  return axiosClient.patch(`/alerts/${id}/escalate`, { action });
};

// ✅ DELETE ALERT
export const deleteAlert = (id) => {
  return axiosClient.delete(`/alerts/${id}`);
};
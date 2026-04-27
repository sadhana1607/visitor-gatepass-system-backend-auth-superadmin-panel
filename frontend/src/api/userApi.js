import axiosClient from "./axiosClient";

/**
 * Get users by role
 */
export const getUsersByRole = (role) => {
  return axiosClient.get("/users", {
    params: { role }
  });
};

/**
 * ✅ RENAMED FUNCTION (IMPORTANT FIX)
 */
export const updateUserStatus = (id, status) => {
  return axiosClient.put(`/employee/status/${id}/`, null, {
    params: { status }
  });
};
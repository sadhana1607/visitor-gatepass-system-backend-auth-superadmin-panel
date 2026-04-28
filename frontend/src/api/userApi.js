import axiosClient from "./axiosClient";

// ✅ GET USERS BY ROLE
export const getUsersByRole = (role) => {
  return axiosClient.get(`/users/role/${role}`);
};

// ✅ UPDATE USER STATUS
export const updateUserStatus = (id, status) => {
  return axiosClient.put(
    `/employee/status/${id}/`,null,   // 🔥 FIXED endpoint
    { status }
  );
};

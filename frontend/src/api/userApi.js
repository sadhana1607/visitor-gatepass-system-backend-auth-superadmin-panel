import axiosClient from "./axiosClient";

// ✅ GET USERS BY ROLE
export const getUsersByRole = (role) => {
  return axiosClient.get(`/users/role/${role}`);
};


// ✅ UPDATE USER STATUS
export const updateUserStatus = (id, status) => {
  return axiosClient.put(
    `/employee/status/${id}`,
    { status }  // ✅ sends { "status": "ACTIVE" } as JSON
  );
};

export const getCurrentUser = () => {
  return axiosClient.get("/users/me");
};

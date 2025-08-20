import apiClient from "./client";

export const usersApi = {
    list: () => apiClient.get("/user_list"),
    create: (form) => apiClient.post("/register", form),
    update: (id, form) => apiClient.put(`/user_update/${id}`, form),
    remove: (id) => apiClient.delete(`/user_delete/${id}`),
};

export default usersApi;


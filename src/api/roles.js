import apiClient from "./client";

export const rolesApi = {
    list: () => apiClient.get("/roles"),
    create: (form) => apiClient.post("/roles", form),
    update: (id, form) => apiClient.put(`/roles/${id}`, form),
    remove: (id) => apiClient.delete(`/roles/${id}`),
};

export default rolesApi;


import apiClient from "./client";

export const permissionsApi = {
    list: () => apiClient.get("/permissions"),
    create: (name) => apiClient.post("/permissions", { name }),
    update: (id, name) => apiClient.put(`/permissions/${id}?name=${encodeURIComponent(name)}`),
    remove: (id) => apiClient.delete(`/permissions/${id}`),
};

export default permissionsApi;


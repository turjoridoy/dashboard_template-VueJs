import apiClient from "./client";

export const authApi = {
    login: (payload) => apiClient.post("/token/", payload),
    refresh: (payload) => apiClient.post("/token/refresh/", payload),
};

export default authApi;


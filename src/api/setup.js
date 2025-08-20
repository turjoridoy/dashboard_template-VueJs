import apiClient from "./client";

export const setupApi = {
    allBranch: () => apiClient.get("/all-branch"),
};

export default setupApi;


import { apiClientV3 } from "./client";

export const studentsApi = {
    list: (params = {}) => apiClientV3.get("/student/", { params }),
};

export default studentsApi;


import axios from "axios";
import { apiBase, apiBaseV3 } from "@/config";
import { setupAxiosInterceptors } from "@/utilities/common";

export const createApiClient = (baseURL) => {
    const instance = axios.create({
        baseURL,
        withCredentials: false,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        timeout: 30000,
    });
    setupAxiosInterceptors(instance);
    return instance;
};

// Default clients per API version
const apiClientV0 = createApiClient(apiBase);
const apiClientV3 = createApiClient(apiBaseV3);

export default apiClientV0;
export { apiClientV0, apiClientV3 };


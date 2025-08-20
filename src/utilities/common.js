import { toast } from 'vue3-toastify';
import Cookies from "js-cookie";
import axios from "axios";
import 'vue3-toastify/dist/index.css';

export const highlightedText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text?.replace(
        regex,
        '<span class="bg-yellow-200 font-semibold">$1</span>'
    );
};

export function formatNumber(number) {
    return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
}

export function hasPermission(route) {
    const user_permissions = JSON.parse(localStorage.getItem("user_permissions"));
    return user_permissions?.some((item) => item == route?.name);
}

export const getToken = () => {
    return {
        headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
    };
};

export const showNotification = (type, message) => {
    toast(message, {
        "theme": "colored",
        "type": type,
        "autoClose": 5000, // Show for 5 seconds
        "position": "top-right",
        "hideProgressBar": false,
        "closeOnClick": true,
        "pauseOnHover": true,
        "draggable": true,
    })
};

// Initialize axios interceptors to attach access token and refresh on 401
let isRefreshing = false;
let pendingRequestsQueue = [];

const onRefreshed = (newAccessToken) => {
    pendingRequestsQueue.forEach((cb) => cb(newAccessToken));
    pendingRequestsQueue = [];
};

export const setupAxiosInterceptors = (maybeAxiosInstanceOrOptions, maybeOptions) => {
    const defaultOptions = { redirectOnAuthFailure: true };

    // Support calling as setupAxiosInterceptors(instance, options) or setupAxiosInterceptors(options)
    const looksLikeAxiosInstance = (obj) => !!(obj && obj.interceptors && obj.interceptors.request && obj.interceptors.response);

    const axiosInstance = looksLikeAxiosInstance(maybeAxiosInstanceOrOptions)
        ? maybeAxiosInstanceOrOptions
        : axios;

    const options = looksLikeAxiosInstance(maybeAxiosInstanceOrOptions)
        ? { ...defaultOptions, ...(maybeOptions || {}) }
        : { ...defaultOptions, ...(maybeAxiosInstanceOrOptions || {}) };

    // Attach Authorization header if access token exists
    axiosInstance.interceptors.request.use((config) => {
        const accessToken = Cookies.get("access_token");
        if (accessToken) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config || {};
            const requestUrl = originalRequest?.url || "";

            // If unauthorized, try refresh once
            if (error?.response?.status === 401 && !originalRequest._retry) {
                // Skip handling 401s coming from the login endpoint so caller can show toast without reload
                // Matches .../token/ but NOT .../token/refresh/
                if (/\/token\/(?!refresh\/)/.test(requestUrl)) {
                    return Promise.reject(error);
                }
                const refreshToken = Cookies.get("refresh_token");
                if (!refreshToken) {
                    // No refresh token => clear and redirect
                    Cookies.remove("access_token");
                    Cookies.remove("refresh_token");
                    localStorage.clear();
                    if (options.redirectOnAuthFailure) window.location.assign("/");
                    return Promise.reject(error);
                }

                if (isRefreshing) {
                    // Queue the request until refresh completes
                    return new Promise((resolve) => {
                        pendingRequestsQueue.push((newToken) => {
                            originalRequest.headers = originalRequest.headers || {};
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            resolve(axiosInstance(originalRequest));
                        });
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;
                try {
                    const { apiBase } = await import("@/config");
                    const refreshResponse = await axiosInstance.post(`${apiBase}/token/refresh/`, { refresh: refreshToken });
                    const newAccessToken = refreshResponse?.data?.access;
                    if (newAccessToken) {
                        // Update cookie
                        Cookies.set("access_token", newAccessToken, { secure: true, sameSite: 'strict' });
                        onRefreshed(newAccessToken);

                        // Retry the original request with new token
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    // Refresh failed => clear and redirect
                    Cookies.remove("access_token");
                    Cookies.remove("refresh_token");
                    localStorage.clear();
                    if (options.redirectOnAuthFailure) window.location.assign("/");
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );
};

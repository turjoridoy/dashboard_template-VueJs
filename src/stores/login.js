import { showNotification } from "@/utilities/common"
import Cookies from "js-cookie"
import { authApi } from "@/api/auth"

export const login = async (data, router) => {
    try {
        const res = await authApi.login({
            email: data.email,
            password: data.password,
        });

        if (res.status === 200 && res.data) {
            const { access, refresh, instructor_id, name, organization_id } = res.data;

            // Store tokens securely in cookies
            const isSecure = typeof window !== 'undefined' && window.location?.protocol === 'https:';
            Cookies.set("access_token", access, { secure: isSecure, sameSite: 'strict' });
            Cookies.set("refresh_token", refresh, { secure: isSecure, sameSite: 'strict' });

            // Store lightweight user info in localStorage`1234
            const userInfo = { instructor_id, name, organization_id };
            localStorage.setItem("user_info", JSON.stringify(userInfo));
            localStorage.setItem("user_permissions", JSON.stringify([]));

            showNotification("success", "Login successful!");
            router.push({ name: "home" });
        } else {
            showNotification("error", "Invalid credentials");
        }

    } catch (err) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        localStorage.clear();
        // Handle the new error response format
        let errorMessage = "Login failed";
        if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
            // New format: { errors: [{ code, param, details }] }
            const firstError = err.response.data.errors[0];
            errorMessage = firstError?.details || firstError?.code || "Authentication failed";
        } else if (err?.response?.data?.detail) {
            // Fallback to detail field
            errorMessage = err.response.data.detail;
        } else if (err?.response?.data?.message) {
            // Fallback to message field
            errorMessage = err.response.data.message;
        } else if (err?.message) {
            // Network or other errors
            errorMessage = err.message;
        }
        showNotification("error", errorMessage);
        throw err; // Re-throw the error so the component can handle it
    }
}

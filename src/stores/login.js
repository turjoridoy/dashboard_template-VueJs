import { apiBase } from "@/config"
import { showNotification } from "@/utilities/common"
import axios from "axios"
import Cookies from "js-cookie"

export const login = async (data, router) => {
    let isLoading = true;
    try {
        // Using GET request with query parameters for the new API
        const res = await axios.get(`${apiBase}/instructor/`, {
            params: {
                email: data.email,
                password: data.password
            }
        });

        isLoading = false;

        // Check if response is successful (200) and has data
        if (res.status === 200 && res.data && res.data.length > 0) {
            const userData = res.data[0]; // Get first user from array

            // Store user data
            Cookies.set("token", "authenticated"); // Placeholder token for now
            localStorage.setItem("user_info", JSON.stringify(userData));

            // Set basic permissions based on user role
            const permissions = [];
            if (userData.is_admin) {
                permissions.push("admin");
            }
            if (userData.is_staff) {
                permissions.push("staff");
            }
            localStorage.setItem("user_permissions", JSON.stringify(permissions));

            showNotification("success", "Login successful!");
            router.push({ name: "home" });
        } else {
            showNotification("error", "Invalid credentials or user not found");
        }

    } catch (err) {
        isLoading = false;
        Cookies.remove("token");
        localStorage.clear();
        showNotification("error", err?.response?.data?.message || err?.message || "Login failed");
    }
    return 1;
}

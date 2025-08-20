import { showNotification } from "@/utilities/common"
import { setupApi } from "@/api/setup"

export const getAllBranch = async () => {
    let res = [];
    try {
        res = await setupApi.allBranch()
    } catch (error) {
        res = [];
        showNotification("error", error?.response?.data?.message || error?.message)
    }
    return res?.data || []
}

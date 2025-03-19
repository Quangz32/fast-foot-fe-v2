import api from "./api";
import { ENDPOINTS } from "../constants/config";

export const userService = {
  async getMe() {
    try {
      const res = await api.get(ENDPOINTS.USER_ME);
      return res;
    } catch {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },
};

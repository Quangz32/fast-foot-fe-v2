import api from "./api";
import { ENDPOINTS } from "../constants/config";

export const categoryService = {
  async getCategories() {
    try {
      const res = await api.get(ENDPOINTS.CATEGORIES);
      return res;
    } catch {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },
};

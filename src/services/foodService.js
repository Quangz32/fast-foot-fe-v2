import api from "./api";
import { ENDPOINTS } from "../constants/config";

export const foodService = {
  async getTopSellingFoods() {
    try {
      const res = await api.get(ENDPOINTS.TOP_SELLING_FOODS);
      return res;
    } catch {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },
};

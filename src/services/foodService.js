import api from "./api";
import { ENDPOINTS } from "../constants/config";

export const foodService = {
  async getTopSellingFoods() {
    try {
      const res = await api.get(ENDPOINTS.TOP_SELLING_FOODS);
      return res;
    } catch (error) {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },

  async getFoods(queryString = "") {
    try {
      const res = await api.get(
        `${ENDPOINTS.FOODS}${queryString ? `?${queryString}` : ""}`
      );
      return res;
    } catch (error) {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },
};

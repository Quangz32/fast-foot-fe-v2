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

  async createFood(data) {
    try {
      const res = await api.post(ENDPOINTS.FOODS, data);
      return res;
    } catch (error) {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },

  async updateFood(id, data) {
    try {
      const res = await api.put(`${ENDPOINTS.FOODS}/${id}`, data);
      return res;
    } catch (error) {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },

  async deleteFood(id) {
    try {
      const res = await api.delete(`${ENDPOINTS.FOODS}/${id}`);
      return res;
    } catch (error) {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },
};

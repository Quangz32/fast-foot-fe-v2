import api from "./api";
import { ENDPOINTS } from "../constants/config";

export const orderService = {
  async createOrderItem(orderItem) {
    try {
      console.log("orderItem", orderItem);
      const res = await api.post(ENDPOINTS.ORDER_ITEMS, orderItem);
      console.log("res", res);
      return res;
    } catch {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },
};

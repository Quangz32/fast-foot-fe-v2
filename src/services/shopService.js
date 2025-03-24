import api from "./api";
import { ENDPOINTS } from "../constants/config";

export const shopService = {
  async registerShop(shop) {
    try {
      const res = await api.post(ENDPOINTS.SHOP_REGISTER, shop);
      return res;
    } catch (error) {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },
};

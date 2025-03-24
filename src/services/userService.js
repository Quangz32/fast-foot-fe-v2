import api from "./api";
import { ENDPOINTS } from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userService = {
  async getMe() {
    try {
      const res = await api.get(ENDPOINTS.USER_ME);
      console.log(res);
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          _id: res._id,
          email: res.email,
          name: res.name,
          phone: res.phone,
          address: res.address,
          role: res.role,
          shopId: res.shopId._id,
          avatar: res.avatar,
        })
      );
      return res;
    } catch {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },

  async updateUser(id, data) {
    try {
      const res = await api.put(`${ENDPOINTS.USERS}/${id}`, data);
      return res;
    } catch (error) {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },
};

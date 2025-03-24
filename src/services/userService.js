import api from "./api";
import { ENDPOINTS } from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userService = {
  async getMe() {
    try {
      const res = await api.get(ENDPOINTS.USER_ME);
      console.log(res);
      await AsyncStorage.setItem("user", JSON.stringify(res));
      return res;
    } catch {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },
};

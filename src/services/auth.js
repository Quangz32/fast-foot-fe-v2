import api from "./api";
import { ENDPOINTS } from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post(ENDPOINTS.LOGIN, credentials);
      console.log(response);
      if (response.accessToken) {
        await AsyncStorage.setItem("accessToken", response.accessToken);
        await AsyncStorage.setItem("refreshToken", response.refreshToken);
      }
      return response;
    } catch (error) {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, { email });
      return response;
    } catch (error) {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },

  logout() {
    localStorage.removeItem("token");
  },
};

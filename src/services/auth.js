import api from './api';
import { ENDPOINTS } from '../constants/config';

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post(ENDPOINTS.LOGIN, credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Đã có lỗi xảy ra' };
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, { email });
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Đã có lỗi xảy ra' };
    }
  },

  logout() {
    localStorage.removeItem('token');
  },
}; 
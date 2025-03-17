import api from './api';
import { ENDPOINTS } from '../constants/config';

export const categoryService = {
    async getCategories(){
        try {
            const res = await api.get(ENDPOINTS.CATEGORIES);
            return res;

        } catch {
            throw error.response?.data || { message: 'Đã có lỗi xảy ra' };

        }
    }
//   async login(credentials) {
//     try {
//       const response = await api.post(ENDPOINTS.LOGIN, credentials);
//       if (response.token) {
//         localStorage.setItem('token', response.token);
//       }
//       return response;
//     } catch (error) {
//       throw error.response?.data || { message: 'Đã có lỗi xảy ra' };
//     }
//   },

//   async forgotPassword(email) {
//     try {
//       const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, { email });
//       return response;
//     } catch (error) {
//       throw error.response?.data || { message: 'Đã có lỗi xảy ra' };
//     }
//   },

//   logout() {
//     localStorage.removeItem('token');
//   },
}; 
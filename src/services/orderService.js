import api from "./api";
import { ENDPOINTS } from "../constants/config";

export const orderService = {
  async createOrderItem(orderItem) {
    try {
      const res = await api.post(ENDPOINTS.ORDER_ITEMS, orderItem);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },

  async getOrders() {
    try {
      const res = await api.get(ENDPOINTS.ORDERS);
      return res;
    } catch (error) {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const res = await api.patch(`${ENDPOINTS.ORDERS}/${orderId}/status`, {
        status,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },

  async rateOrder(orderId, rating, comment) {
    try {
      const res = await api.post(`${ENDPOINTS.ORDERS}/${orderId}/rate`, {
        rating,
        comment,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: "Đã có lỗi xảy ra" };
    }
  },

  // createOrderItem: async (orderData) => {
  //   try {
  //     const response = await axios.post("/orders/items", orderData);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error creating order item:", error);
  //     throw error;
  //   }
  // },

  // updateOrderStatus: async (orderId, status) => {
  //   try {
  //     const response = await axios.patch(`/orders/${orderId}/status`, {
  //       status,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error updating order status:", error);
  //     throw error;
  //   }
  // },

  // rateOrder: async (orderId, rating, comment) => {
  //   try {
  //     const response = await axios.post(`/orders/${orderId}/rate`, {
  //       rating,
  //       comment,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error rating order:", error);
  //     throw error;
  //   }
  // },
};

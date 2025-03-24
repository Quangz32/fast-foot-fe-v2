import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_URL_IMAGE } from "../../../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { orderService } from "../../../services/orderService";

const OrderItem = ({ order, fetchOrders }) => {
  console.log(order);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem("user");
      setUser(JSON.parse(user));
    };
    fetchUser();
  }, []);

  const isCustomer = user?._id === order?.customerId;
  const isShop = user?._id === order?.shopId.userId;

  const canPlace = isCustomer && order.status === "creating";
  const canConfirm = isShop && order.status === "placed";
  const canCancel =
    (isCustomer &&
      ["creating", "placed", "preparing"].includes(order.status)) ||
    (isShop && ["placed", "preparing", "delivering"].includes(order.status));
  const canDeliver = isShop && order.status === "preparing";
  const canDelivered = isShop && order.status === "delivering";
  const canReceive = isCustomer && order.status === "delivered";
  const canRate = isCustomer && order.status === "received";

  // Calculate total price for each item including options
  const items = order.items.map((item) => {
    const optionsPriceDiff = item.options.reduce(
      (sum, opt) => sum + (opt.priceDiff || 0),
      0
    );
    const totalPrice = (item.foodId.price + optionsPriceDiff) * item.quantity;
    return {
      ...item,
      totalPrice,
    };
  });

  const updateOrderStatus = async (orderId, status) => {
    try {
      if (isCustomer && ["placed", "received", "cancelled"].includes(status)) {
        await orderService.updateOrderStatusByCustomer(orderId, status);
      } else if (
        isShop &&
        ["preparing", "delivering", "delivered", "cancelled"].includes(status)
      ) {
        await orderService.updateOrderStatusByShop(orderId, status);
      }

      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Shop Info */}
      <View style={styles.shopInfo}>
        <Icon name="store" size={20} color="#666" />
        <Text style={styles.shopName}>{order.shopId.shopName}</Text>
      </View>

      {/* Order Items */}
      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <View key={item._id} style={styles.itemRow}>
            <View style={styles.itemMainInfo}>
              <Image
                source={{ uri: `${API_URL_IMAGE}${item.foodId.image}` }}
                style={styles.foodImage}
              />
              <View style={styles.itemDetails}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.foodId.name}</Text>
                  <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                </View>
                {item.options.length > 0 && (
                  <Text style={styles.itemOptions}>
                    {item.options
                      .map((opt) => `${opt.name}: ${opt.value}`)
                      .join(", ")}
                  </Text>
                )}
                <Text style={styles.itemPrice}>
                  {item.totalPrice.toLocaleString()}đ
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Total Amount */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Tổng tiền:</Text>
        <Text style={styles.totalAmount}>
          {order.totalAmount.toLocaleString()}đ
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {canPlace && (
          <TouchableOpacity
            style={[styles.actionButton, styles.placeButton]}
            onPress={() => {
              updateOrderStatus(order._id, "placed");
              console.log("Place order:", order._id);
            }}
          >
            <Text style={styles.actionButtonText}>Đặt hàng</Text>
          </TouchableOpacity>
        )}

        {canConfirm && (
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => {
              updateOrderStatus(order._id, "preparing");
              console.log("Confirm order:", order._id);
            }}
          >
            <Text style={styles.actionButtonText}>Xác nhận</Text>
          </TouchableOpacity>
        )}
        {canCancel && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => {
              updateOrderStatus(order._id, "cancelled");
              console.log("Cancel order:", order._id);
            }}
          >
            <Text style={styles.cancelButtonText}>Huỷ đơn</Text>
          </TouchableOpacity>
        )}
        {canDeliver && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deliverButton]}
            onPress={() => {
              updateOrderStatus(order._id, "delivering");
              console.log("Deliver order:", order._id);
            }}
          >
            <Text style={styles.actionButtonText}>Giao hàng</Text>
          </TouchableOpacity>
        )}
        {canDelivered && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deliveredButton]}
            onPress={() => {
              updateOrderStatus(order._id, "delivered");
              console.log("Mark as delivered:", order._id);
            }}
          >
            <Text style={styles.actionButtonText}>Đã giao</Text>
          </TouchableOpacity>
        )}
        {canReceive && (
          <TouchableOpacity
            style={[styles.actionButton, styles.receiveButton]}
            onPress={() => {
              updateOrderStatus(order._id, "received");
              console.log("Receive order:", order._id);
            }}
          >
            <Text style={styles.actionButtonText}>Đã nhận hàng</Text>
          </TouchableOpacity>
        )}
        {canRate && (
          <TouchableOpacity
            style={[styles.actionButton, styles.rateButton]}
            onPress={() => {
              console.log("Rate order:", order._id);
            }}
          >
            <Text style={styles.actionButtonText}>Đánh giá</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shopInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  shopName: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemRow: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    paddingBottom: 12,
  },
  itemMainInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    marginRight: 8,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  itemOptions: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: "#ff4d4f",
    marginTop: 4,
    textAlign: "right",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff4d4f",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: "center",
  },
  placeButton: {
    backgroundColor: "#ff4d4f",
  },
  confirmButton: {
    backgroundColor: "#4CAF50", // Green for confirm
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  deliverButton: {
    backgroundColor: "#2196F3", // Blue for deliver
  },
  deliveredButton: {
    backgroundColor: "#ff9800", // Orange for delivered
  },
  receiveButton: {
    backgroundColor: "#ff4d4f",
  },
  rateButton: {
    backgroundColor: "#ff4d4f",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default OrderItem;

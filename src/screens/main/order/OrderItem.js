import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_URL_IMAGE } from "../../../constants/config";

const OrderItem = ({ order }) => {
  console.log("order in OrderItem", order);
  const canPlace = order.status === "creating";
  console.log("canPlace", canPlace);
  const canCancel = ["creating", "confirmed", "preparing"].includes(
    order.status
  );
  const canReceive = order.status === "delivered";
  const canRate = order.status === "completed";

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
              console.log("Place order:", order._id);
            }}
          >
            <Text style={styles.actionButtonText}>Đặt hàng</Text>
          </TouchableOpacity>
        )}
        {canCancel && (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => {
              console.log("Cancel order:", order._id);
            }}
          >
            <Text style={styles.cancelButtonText}>Huỷ đơn</Text>
          </TouchableOpacity>
        )}
        {canReceive && (
          <TouchableOpacity
            style={[styles.actionButton, styles.receiveButton]}
            onPress={() => {
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
  cancelButton: {
    backgroundColor: "#f5f5f5",
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

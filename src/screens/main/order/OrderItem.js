import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_URL_IMAGE } from "../../../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { orderService } from "../../../services/orderService";
import { useNavigation } from "@react-navigation/native";

const OrderItem = ({ order, fetchOrders }) => {
  console.log(order);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [note, setNote] = useState(order.note || "");
  const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod || "cash");
  const [deliveryAddress, setDeliveryAddress] = useState(order.deliveryAddress || "");

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
  const canEdit = isCustomer && order.status === "creating";
  const canConfirm = isShop && order.status === "placed";
  const canCancel =
    (isCustomer && ["creating", "placed", "preparing"].includes(order.status)) ||
    (isShop && ["placed", "preparing", "delivering"].includes(order.status));
  const canDeliver = isShop && order.status === "preparing";
  const canDelivered = isShop && order.status === "delivering";
  const canReceive = isCustomer && order.status === "delivered";
  const canRate = isCustomer && order.status === "received";

  // Calculate total price for each item including options
  const items = order.items.map((item) => {
    const optionsPriceDiff = item.options.reduce((sum, opt) => sum + (opt.priceDiff || 0), 0);
    const totalPrice = (item.foodId?.price + optionsPriceDiff) * item.quantity;
    return {
      ...item,
      totalPrice,
    };
  });

  const updateOrderStatus = async (orderId, status) => {
    try {
      if (isCustomer && ["placed", "received", "cancelled"].includes(status)) {
        await orderService.updateOrderStatusByCustomer(orderId, status);
      } else if (isShop && ["preparing", "delivering", "delivered", "cancelled"].includes(status)) {
        await orderService.updateOrderStatusByShop(orderId, status);
      }

      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleUpdateOrder = async () => {
    try {
      await orderService.updateOrder(order._id, {
        note,
        paymentMethod,
        deliveryAddress,
      });
      setEditModalVisible(false);
      fetchOrders();
      Alert.alert("Thành công", "Đã cập nhật thông tin đơn hàng");
    } catch (error) {
      console.error("Error updating order:", error);
      Alert.alert("Lỗi", error.message || "Đã có lỗi xảy ra khi cập nhật đơn hàng");
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
                    {item.options.map((opt) => `${opt.name}: ${opt.value}`).join(", ")}
                  </Text>
                )}
                <Text style={styles.itemPrice}>{item.totalPrice.toLocaleString()}đ</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Order Details */}
      {order.note && (
        <View style={styles.noteContainer}>
          <Text style={styles.noteLabel}>Ghi chú:</Text>
          <Text style={styles.noteText}>{order.note}</Text>
        </View>
      )}

      {/* Payment Method */}
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Phương thức thanh toán:</Text>
        <Text style={styles.detailText}>
          {paymentMethod === "cash" && "Tiền mặt"}
          {paymentMethod === "credit_card" && "Thẻ tín dụng"}
          {paymentMethod === "e_wallet" && "Ví điện tử"}
        </Text>
      </View>

      {/* Delivery Address */}
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Địa chỉ giao hàng:</Text>
        <Text style={styles.detailText}>{order.deliveryAddress}</Text>
      </View>

      {/* Total Amount */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Tổng tiền:</Text>
        <Text style={styles.totalAmount}>{order.totalAmount.toLocaleString()}đ</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {canEdit && (
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => {
              setEditModalVisible(true);
              setNote(order.note || "");
              setPaymentMethod(order.paymentMethod || "cash");
              setDeliveryAddress(order.deliveryAddress || "");
            }}
          >
            <Text style={styles.actionButtonText}>Sửa đơn hàng</Text>
          </TouchableOpacity>
        )}

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
              navigation.navigate("ReviewOrder", { orderId: order._id });
              console.log("Rate order:", order._id);
            }}
          >
            <Text style={styles.actionButtonText}>Đánh giá</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Edit Order Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa đơn hàng</Text>

            {/* Note Input */}
            <Text style={styles.inputLabel}>Ghi chú</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập ghi chú (tùy chọn)"
              value={note}
              onChangeText={setNote}
              multiline={true}
            />

            {/* Payment Method Selection */}
            <Text style={styles.inputLabel}>Phương thức thanh toán</Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === "cash" && styles.paymentOptionSelected,
                ]}
                onPress={() => setPaymentMethod("cash")}
              >
                <Icon name="cash" size={24} color={paymentMethod === "cash" ? "#fff" : "#666"} />
                <Text
                  style={[
                    styles.paymentOptionText,
                    paymentMethod === "cash" && styles.paymentOptionTextSelected,
                  ]}
                >
                  Tiền mặt
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === "credit_card" && styles.paymentOptionSelected,
                ]}
                onPress={() => setPaymentMethod("credit_card")}
              >
                <Icon
                  name="credit-card"
                  size={24}
                  color={paymentMethod === "credit_card" ? "#fff" : "#666"}
                />
                <Text
                  style={[
                    styles.paymentOptionText,
                    paymentMethod === "credit_card" && styles.paymentOptionTextSelected,
                  ]}
                >
                  Thẻ tín dụng
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  paymentMethod === "e_wallet" && styles.paymentOptionSelected,
                ]}
                onPress={() => setPaymentMethod("e_wallet")}
              >
                <Icon
                  name="wallet"
                  size={24}
                  color={paymentMethod === "e_wallet" ? "#fff" : "#666"}
                />
                <Text
                  style={[
                    styles.paymentOptionText,
                    paymentMethod === "e_wallet" && styles.paymentOptionTextSelected,
                  ]}
                >
                  Ví điện tử
                </Text>
              </TouchableOpacity>
            </View>

            {/* Delivery Address Input */}
            <Text style={styles.inputLabel}>Địa chỉ giao hàng</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập địa chỉ giao hàng"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
            />

            {/* Modal Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelModalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveModalButton]}
                onPress={handleUpdateOrder}
              >
                <Text style={styles.saveModalButtonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  shopInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  shopName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemRow: {
    marginBottom: 12,
  },
  itemMainInfo: {
    flexDirection: "row",
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  itemOptions: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ff4d4f",
    marginTop: 4,
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
    fontSize: 16,
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 18,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  placeButton: {
    backgroundColor: "#ff4d4f",
  },
  editButton: {
    backgroundColor: "#1890ff",
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
  noteContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  noteText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  paymentOption: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginHorizontal: 4,
  },
  paymentOptionSelected: {
    backgroundColor: "#ff4d4f",
    borderColor: "#ff4d4f",
  },
  paymentOptionText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  paymentOptionTextSelected: {
    color: "#fff",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  cancelModalButton: {
    backgroundColor: "#f5f5f5",
  },
  saveModalButton: {
    backgroundColor: "#ff4d4f",
  },
  cancelModalButtonText: {
    color: "#666",
    fontSize: 14,
  },
  saveModalButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default OrderItem;

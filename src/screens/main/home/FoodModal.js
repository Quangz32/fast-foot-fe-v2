// FoodModal.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import { API_URL_IMAGE } from "../../../constants/config";

const FoodModal = ({ visible, food, onClose, onAddToCart, onPlaceOrder }) => {
  if (!food) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            source={{ uri: `${API_URL_IMAGE}${food.foodDetails.image}` }}
            style={styles.modalImage}
          />
          <Text style={styles.modalTitle}>{food.foodDetails.name}</Text>
          <Text style={styles.modalPrice}>
            Giá: {food.foodDetails.price.toLocaleString()}đ
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.button} onPress={onPlaceOrder}>
              <Text style={styles.buttonText}>Đặt ngay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onAddToCart}>
              <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  modalPrice: {
    fontSize: 16,
    color: "#ff4d4f",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    backgroundColor: "#ff4d4f",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#000",
  },
});

export default FoodModal;

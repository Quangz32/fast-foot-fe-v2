// FoodModal.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_URL_IMAGE } from "../../../constants/config";
import { orderService } from "../../../services/orderService";

const FoodModal = ({ visible, food, onClose, onPlaceOrder }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (food) {
      // Initialize selected options with the first value of each option
      const initialOptions = {};
      food.foodDetails.options?.forEach((option) => {
        if (option.values.length > 0) {
          initialOptions[option._id] = option.values[0]._id;
        }
      });
      setSelectedOptions(initialOptions);
      setQuantity(1); // Reset quantity when food changes
    }
  }, [food]);

  useEffect(() => {
    if (food) {
      let price = food.foodDetails.price;

      // Add price differences from selected options
      Object.entries(selectedOptions).forEach(([optionId, valueId]) => {
        const option = food.foodDetails.options.find(
          (opt) => opt._id === optionId
        );
        if (option) {
          const selectedValue = option.values.find(
            (val) => val._id === valueId
          );
          if (selectedValue) {
            price += selectedValue.priceDiff;
          }
        }
      });

      setTotalPrice(price * quantity);
    }
  }, [selectedOptions, food, quantity]);

  if (!food) return null;

  const handleOptionSelect = (optionId, valueId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueId,
    }));
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => {
      const newQuantity = prev + change;
      return newQuantity < 1 ? 1 : newQuantity;
    });
  };

  const handleAddToCart = async () => {
    const options = Object.entries(selectedOptions)
      .map(([optionId, valueId]) => {
        const option = food.foodDetails.options.find(
          (opt) => opt._id === optionId
        );
        if (option) {
          const selectedValue = option.values.find(
            (val) => val._id === valueId
          );
          if (selectedValue) {
            return {
              name: option.name,
              value: selectedValue.name,
            };
          }
        }
        return null;
      })
      .filter(Boolean);

    const requestBody = {
      foodId: food.foodDetails._id,
      options: options,
      quantity: quantity,
    };

    console.log("requestBody", requestBody);
    const res = await orderService.createOrderItem(requestBody);
    console.log("res", res);

    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView style={styles.scrollView}>
            <Image
              source={{ uri: `${API_URL_IMAGE}${food.foodDetails.image}` }}
              style={styles.modalImage}
            />
            <View style={styles.contentContainer}>
              <Text style={styles.modalTitle}>{food.foodDetails.name}</Text>
              <Text style={styles.modalDescription}>
                {food.foodDetails.description}
              </Text>

              {/* Options Selection */}
              {food.foodDetails.options?.map((option) => (
                <View key={option._id} style={styles.optionContainer}>
                  <Text style={styles.optionTitle}>{option.name}</Text>
                  <View style={styles.optionValues}>
                    {option.values.map((value) => (
                      <TouchableOpacity
                        key={value._id}
                        style={[
                          styles.optionValue,
                          selectedOptions[option._id] === value._id &&
                            styles.selectedOptionValue,
                        ]}
                        onPress={() =>
                          handleOptionSelect(option._id, value._id)
                        }
                      >
                        <Text
                          style={[
                            styles.optionValueText,
                            selectedOptions[option._id] === value._id &&
                              styles.selectedOptionValueText,
                          ]}
                        >
                          {value.name}
                        </Text>
                        {value.priceDiff > 0 && (
                          <Text style={styles.priceDiffText}>
                            +{value.priceDiff.toLocaleString()}đ
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}

              {/* Quantity Selection */}
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityTitle}>Số lượng</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(-1)}
                  >
                    <Icon name="minus" size={20} color="#ff4d4f" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(1)}
                  >
                    <Icon name="plus" size={20} color="#ff4d4f" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Price Display */}
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Tổng giá:</Text>
                <Text style={styles.totalPrice}>
                  {totalPrice.toLocaleString()}đ
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.addToCartButton]}
              onPress={handleAddToCart}
            >
              <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.orderButton]}
              onPress={() => onPlaceOrder({ ...food, totalPrice, quantity })}
            >
              <Text style={styles.buttonText}>Đặt ngay</Text>
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  scrollView: {
    maxHeight: "80%",
  },
  contentContainer: {
    padding: 16,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  optionContainer: {
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  optionValues: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionValue: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  selectedOptionValue: {
    backgroundColor: "#ff4d4f",
    borderColor: "#ff4d4f",
  },
  optionValueText: {
    fontSize: 14,
    color: "#333",
  },
  selectedOptionValueText: {
    color: "#fff",
  },
  priceDiffText: {
    fontSize: 12,
    color: "#ff4d4f",
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  quantityTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ff4d4f",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  priceLabel: {
    fontSize: 16,
    color: "#666",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff4d4f",
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  addToCartButton: {
    backgroundColor: "#ff4d4f",
  },
  orderButton: {
    backgroundColor: "#ff4d4f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#666",
    fontSize: 14,
  },
});

export default FoodModal;

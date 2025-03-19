// FoodItem.js
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_URL_IMAGE } from "../../../constants/config";

const FoodItem = ({ item, onPress }) => {
  const food = item.foodDetails;
  const shop = item.shopDetails;
  const discountPercent = Math.round(
    ((food.originalPrice - food.price) / food.price) * 100
  );

  return (
    <TouchableOpacity style={styles.discountedItem} onPress={onPress}>
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>- {discountPercent}%</Text>
      </View>
      <Image
        source={{
          uri: `${API_URL_IMAGE}${food?.image || "/uploads/placeholder.png"}`,
        }}
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{food.name}</Text>
        <View style={styles.shop}>
          <Icon name="chef-hat" size={20} color={"black"} />
          <Text style={styles.restaurantName}>{shop.name}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>
            {food.originalPrice?.toLocaleString()}đ
          </Text>
          <Text style={styles.discountedPrice}>
            {food.price?.toLocaleString()}đ
          </Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={onPress}>
          <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  discountedItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ff4d4f",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  itemImage: {
    width: "100%",
    height: 200,
  },
  itemInfo: {
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  shop: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  restaurantName: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  discountedPrice: {
    fontSize: 16,
    color: "#ff4d4f",
    fontWeight: "bold",
  },

  addToCartButton: {
    backgroundColor: "#ff4d4f",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  addToCartText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FoodItem;

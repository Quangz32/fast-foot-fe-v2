import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";
import { foodService } from "../services/foodService";

import { API_URL_IMAGE } from "../constants/config";
const discountedItems = [
  {
    id: 1,
    name: "Cánh gà",
    restaurant: "Hi-Chicken",
    originalPrice: 39000,
    discountedPrice: 20000,
    discount: 48.7,
    image: require("../../assets/products/canh-ga.jpg"),
    time: "0.2 phút",
    distance: "0,12km",
    isNew: true,
    isOpen: true,
  },
  {
    id: 2,
    name: "Xúc xích",
    restaurant: "Hi-Chicken",
    originalPrice: 15000,
    discountedPrice: 8000,
    discount: 46.7,
    image: require("../../assets/products/xuc-xich.jpg"),
    time: "0.2 phút",
    distance: "0,12km",
    isNew: true,
    isOpen: true,
  },
];

const FoodsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [topSellingFoods, setTopSellingFoods] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchTopSellingFoods();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      console.log(response);
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTopSellingFoods = async () => {
    try {
      const response = await foodService.getTopSellingFoods();
      console.log(response);
      setTopSellingFoods(response);
    } catch (error) {
      console.error("Error fetching hot selling foods:", error);
    }
  };

  const getFoodItemView = (item) => {
    if (!item.foodDetails) return null;
    const food = item.foodDetails;
    const shop = item.shopDetails;
    const discountPercent = Math.round(
      ((food.originalPrice - food.price) / food.price) * 100
    );

    return (
      <TouchableOpacity key={item.id} style={styles.discountedItem}>
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
          <View style={styles.itemFooter}>
            {/* <Text style={styles.deliveryInfo}>
              {item.time} • {item.distance}
            </Text> */}
            {/* {item.isNew && <Text style={styles.newBadge}>Mới ⭐️</Text>} */}
          </View>
          {item.isOpen && (
            <View style={styles.openBadge}>
              <Text style={styles.openText}>ĐANG MỞ CỬA</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with location */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Giao đến</Text>
          <View style={styles.locationContent}>
            <Icon name="map-marker" size={20} color="#ff4d4f" />
            <Text style={styles.locationText} numberOfLines={1}>
              194 Quốc Lộ 21 Thôn 3 Xã Thạch Hòa,Huyện Thạch Thất,Thành Phố Hà
              Nội
            </Text>
            <TouchableOpacity>
              <Icon name="refresh" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Bạn muốn ăn gì hôm nay?"
          placeholderTextColor="#999"
        />
      </View>

      {/* Food categories */}
      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesGrid}>
          {categories?.map((category) => (
            <TouchableOpacity
              key={category._id}
              style={styles.categoryItem}
              onPress={() => {}}
            >
              <Image
                source={{ uri: `${API_URL_IMAGE}${category.image}` }}
                style={styles.categoryImage}
                resizeMode="cover"
              />
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Discounted items */}
      <View style={styles.discountedSection}>
        <Text style={styles.sectionTitle}>Món hót hòn họt</Text>
        <View style={styles.discountedItems}>
          {topSellingFoods.map((item) => getFoodItemView(item))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  locationContainer: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: "#666",
  },
  locationContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    marginHorizontal: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    padding: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: 20,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  categoryName: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
    marginTop: 8,
  },
  discountedSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  discountedItems: {
    gap: 16,
  },
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
    marginTop: 4,
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
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  deliveryInfo: {
    fontSize: 12,
    color: "#666",
  },
  newBadge: {
    fontSize: 12,
    color: "#ff4d4f",
  },
  openBadge: {
    backgroundColor: "#e6f7ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  openText: {
    color: "#1890ff",
    fontSize: 12,
  },
});

export default FoodsScreen;

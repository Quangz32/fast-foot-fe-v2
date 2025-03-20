// FoodsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { categoryService } from "../../../services/categoryService";
import { foodService } from "../../../services/foodService";
import FoodItem from "./FoodItem"; // Import FoodItem
import FoodModal from "./FoodModal"; // Import FoodModal
import { API_URL_IMAGE } from "../../../constants/config";

const FoodsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [topSellingFoods, setTopSellingFoods] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchTopSellingFoods();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      console.log("categories", response);
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTopSellingFoods = async () => {
    try {
      const response = await foodService.getTopSellingFoods();
      console.log("selling foods", response);
      setTopSellingFoods(response);
    } catch (error) {
      console.error("Error fetching hot selling foods:", error);
    }
  };

  const openModal = (item) => {
    setSelectedFood(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFood(null);
  };

  const placeOrder = () => {
    alert(`Đặt hàng thành công món ${selectedFood.foodDetails.name}!`);
    closeModal();
  };

  // const addToCart = () => {
  //   if (selectedFood) {
  //     alert(`${selectedFood.foodDetails.name} đã được thêm vào giỏ hàng!`);
  //     closeModal();
  //   }
  // };

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
          {topSellingFoods.map((item) => (
            <FoodItem
              key={item._id}
              item={item}
              onPress={() => openModal(item)}
            />
          ))}
        </View>
      </View>

      {/* Modal for food options */}
      <FoodModal
        visible={modalVisible}
        food={selectedFood}
        onClose={closeModal}
        onPlaceOrder={placeOrder}
      />
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
});

export default FoodsScreen;

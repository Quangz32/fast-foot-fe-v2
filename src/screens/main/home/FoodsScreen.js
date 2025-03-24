import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { foodService } from "../../../services/foodService";
import { categoryService } from "../../../services/categoryService";
import FoodItem from "./FoodItem";
import FoodModal from "./FoodModal";
import Toast from "react-native-toast-message";

const FoodsScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState(
    route.params?.searchQuery || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    route.params?.categoryId || null
  );
  const [selectedShop, setSelectedShop] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, [selectedCategory, selectedShop, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchFoods = async () => {
    try {
      let queryParams = new URLSearchParams();

      if (selectedShop) {
        queryParams.append("shopId", selectedShop);
      }
      if (selectedCategory) {
        queryParams.append("categoryId", selectedCategory);
      }
      if (sortBy) {
        queryParams.append("sortBy", sortBy);
      }
      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }

      const response = await foodService.getFoods(queryParams.toString());

      const foods = response.map((item) => ({
        _id: item._id,
        name: item.name,
        image: item.image,
        originalPrice: item.originalPrice,
        price: item.price,
        options: item.options,
        shop: item.shopId,
      }));
      console.log("foods", foods);
      setFoods(foods);
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  };

  const handleSearch = () => {
    fetchFoods();
  };

  const toggleSort = (type) => {
    setSortBy(sortBy === type ? "" : type);
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

  const showToast = (message, type) => {
    Toast.show({
      text1: message,
      type: type,
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Danh sách món ăn</Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Icon name="magnify" size={20} color="#666" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm món ăn..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.categoriesRow}>
          <TouchableOpacity
            style={[
              styles.categoryChip,
              !selectedCategory && styles.selectedCategoryChip,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryChipText,
                !selectedCategory && styles.selectedCategoryChipText,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category._id}
              style={[
                styles.categoryChip,
                selectedCategory === category._id &&
                  styles.selectedCategoryChip,
              ]}
              onPress={() => setSelectedCategory(category._id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category._id &&
                    styles.selectedCategoryChipText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderSortButtons = () => (
    <View style={styles.sortContainer}>
      <TouchableOpacity
        style={[
          styles.sortButton,
          sortBy === "-price" && styles.activeSortButton,
        ]}
        onPress={() => toggleSort("-price")}
      >
        <Text
          style={[
            styles.sortButtonText,
            sortBy === "-price" && styles.activeSortButtonText,
          ]}
        >
          Giá giảm dần
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.sortButton,
          sortBy === "price" && styles.activeSortButton,
        ]}
        onPress={() => toggleSort("price")}
      >
        <Text
          style={[
            styles.sortButtonText,
            sortBy === "price" && styles.activeSortButtonText,
          ]}
        >
          Giá tăng dần
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderSearchBar()}
      {renderFilters()}
      {renderSortButtons()}

      <FlatList
        data={foods}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.foodItemContainer}>
            <FoodItem item={item} onPress={() => openModal(item)} />
          </View>
        )}
        contentContainerStyle={styles.foodList}
        numColumns={2}
      />

      <FoodModal
        visible={modalVisible}
        food={selectedFood}
        onClose={closeModal}
        showToast={showToast}
        onPlaceOrder={placeOrder}
      />
      <Toast />
    </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
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
  filtersContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
  },
  categoriesRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  selectedCategoryChip: {
    backgroundColor: "#ff4d4f",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#666",
  },
  selectedCategoryChipText: {
    color: "#fff",
  },
  sortContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  activeSortButton: {
    backgroundColor: "#ff4d4f",
  },
  sortButtonText: {
    fontSize: 14,
    color: "#666",
  },
  activeSortButtonText: {
    color: "#fff",
  },
  foodList: {},
  foodItemContainer: {
    // width: "50%",
    marginHorizontal: 6,
    marginVertical: 6,
  },
});

export default FoodsScreen;

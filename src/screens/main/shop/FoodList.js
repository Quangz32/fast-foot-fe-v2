import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { foodService } from "../../../services/foodService";
import { API_URL_IMAGE } from "../../../constants/config";

const FoodList = ({ onEditFood }) => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const queryString = "shopId=67d7b6633078aeb7158d10d3";
      const foods = await foodService.getFoods(queryString);
      setFoods(foods);
    } catch (error) {
      console.error("Error fetching foods:", error);
      Alert.alert("Error", "Failed to fetch food items");
    }
  };

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodItem}>
      <Image
        // source={{ uri: item.image }}
        source={{
          uri: `${API_URL_IMAGE}${item?.image || "/uploads/placeholder.png"}`,
        }}
        style={styles.foodImage}
        defaultSource={require("../../../../assets/default-food.jpg")}
      />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodPrice}>${item.price}</Text>
        <Text style={styles.foodDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => onEditFood(item)}
      >
        <Icon name="pencil" size={24} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={foods}
      renderItem={renderFoodItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  foodItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  foodInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  foodPrice: {
    fontSize: 14,
    color: "#ff4d4f",
    marginBottom: 4,
  },
  foodDescription: {
    fontSize: 12,
    color: "#666",
  },
  editButton: {
    padding: 8,
    justifyContent: "center",
  },
});

export default FoodList;

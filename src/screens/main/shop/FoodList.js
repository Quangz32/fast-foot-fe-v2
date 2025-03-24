import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { foodService } from "../../../services/foodService";
import { API_URL_IMAGE } from "../../../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const FoodList = ({ onEditFood }) => {
  const [foods, setFoods] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const userJSON = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJSON);
      const queryString = `shopId=${user.shopId}`;
      const foods = await foodService.getFoods(queryString);
      setFoods(foods);
    } catch (error) {
      console.error("Error fetching foods:", error);
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra",
        text2: "Không thể tải danh sách món ăn",
      });
    }
  };

  const handleDelete = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedFood) {
      try {
        await foodService.deleteFood(selectedFood._id);
        Toast.show({
          type: "success",
          text1: "Xoá món ăn thành công",
        });
        fetchFoods(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting food:", error);
        Toast.show({
          type: "error",
          text1: "Có lỗi xảy ra",
          text2: error.response?.data?.message || "Vui lòng thử lại sau",
        });
      } finally {
        setModalVisible(false);
        setSelectedFood(null);
      }
    }
  };

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodItem}>
      <Image
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
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEditFood(item)}
        >
          <Icon name="pencil" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item)}
        >
          <Icon name="delete" size={24} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        data={foods}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.container}
      />
      <Toast />

      {/* Modal for delete confirmation */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận xoá</Text>
            <Text style={styles.modalMessage}>
              Bạn có chắc chắn muốn xoá món ăn này?
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Huỷ" onPress={() => setModalVisible(false)} />
              <Button title="Xoá" color="red" onPress={confirmDelete} />
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  actionButtons: {
    flexDirection: "column",
    justifyContent: "space-around",
    paddingLeft: 8,
  },
  actionButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default FoodList;

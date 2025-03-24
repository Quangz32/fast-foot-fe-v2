import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AddFood from "./AddFood";
import FoodList from "./FoodList";

const ShopManagementScreen = () => {
  const [showAddFoodForm, setShowAddFoodForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const handleEditFood = (food) => {
    setEditingFood(food);
    setShowAddFoodForm(true);
  };

  const handleCancel = () => {
    setShowAddFoodForm(false);
    setEditingFood(null);
  };

  return (
    <View style={styles.container}>
      {!showAddFoodForm ? (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddFoodForm(true)}
          >
            <Text style={styles.addButtonText}>Add New Food Item</Text>
          </TouchableOpacity>
          <FoodList onEditFood={handleEditFood} />
        </View>
      ) : (
        <AddFood onCancel={handleCancel} editingFood={editingFood} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#ff4d4f",
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ShopManagementScreen;

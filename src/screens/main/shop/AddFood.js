import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Picker,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { categoryService } from "../../../services/categoryService";
import { foodService } from "../../../services/foodService";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
const AddFood = ({ onCancel, editingFood }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    categoryId: "",
    options: [
      {
        name: "",
        values: [{ name: "", priceDiff: 0 }],
      },
    ],
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (editingFood) {
      setFormData({
        name: editingFood.name || "",
        description: editingFood.description || "",
        price: editingFood.price?.toString() || "",
        originalPrice: editingFood.originalPrice?.toString() || "",
        categoryId: editingFood.category?._id || "",
        options: editingFood.options || [
          {
            name: "",
            values: [{ name: "", priceDiff: 0 }],
          },
        ],
      });
      if (editingFood.image) {
        setImage({
          uri: editingFood.image,
          base64: null, // We don't have base64 for existing images
        });
      } else {
        setImage(null);
      }
    } else {
      // Reset form when not editing
      setFormData({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        categoryId: "",
        options: [
          {
            name: "",
            values: [{ name: "", priceDiff: 0 }],
          },
        ],
      });
      setImage(null);
    }
  }, [editingFood]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to fetch categories");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage({
        uri: result.assets[0].uri,
        base64: result.assets[0].base64,
      });
    }
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          name: "",
          values: [{ name: "", priceDiff: 0 }],
        },
      ],
    }));
  };

  const removeOption = (optionIndex) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, index) => index !== optionIndex),
    }));
  };

  const addValue = (optionIndex) => {
    setFormData((prev) => {
      const newOptions = [...prev.options];
      newOptions[optionIndex].values.push({ name: "", priceDiff: 0 });
      return { ...prev, options: newOptions };
    });
  };

  const removeValue = (optionIndex, valueIndex) => {
    setFormData((prev) => {
      const newOptions = [...prev.options];
      newOptions[optionIndex].values = newOptions[optionIndex].values.filter(
        (_, index) => index !== valueIndex
      );
      return { ...prev, options: newOptions };
    });
  };

  const handleSubmit = async () => {
    try {
      // Create the request body
      const requestBody = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        originalPrice: formData.originalPrice,
        categoryId: formData.categoryId,
        optionsJSON: JSON.stringify(formData.options),
      };

      // Add base64 image if exists
      if (image && image.base64) {
        requestBody.imageBase64 = image.base64;
      }

      let response;
      if (editingFood) {
        // Update existing food
        response = await foodService.updateFood(editingFood._id, requestBody);
        Toast.show({
          type: "success",
          text1: "Cập nhật món ăn thành công",
        });
      } else {
        // Create new food
        response = await foodService.createFood(requestBody);
        Toast.show({
          type: "success",
          text1: "Thêm món ăn thành công",
        });
      }

      onCancel(); // Close form after success
    } catch (error) {
      console.error("Error submitting form:", error);
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra",
        text2: error.response?.data?.message || "Vui lòng thử lại sau",
      });
    }
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận xoá", "Bạn có chắc chắn muốn xoá món ăn này không?", [
      {
        text: "Huỷ",
        style: "cancel",
      },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await foodService.deleteFood(editingFood._id);
            Toast.show({
              type: "success",
              text1: "Xoá món ăn thành công",
            });
            onCancel(); // Close form after successful deletion
          } catch (error) {
            console.error("Error deleting food:", error);
            Toast.show({
              type: "error",
              text1: "Có lỗi xảy ra",
              text2: error.response?.data?.message || "Vui lòng thử lại sau",
            });
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.title}>
          {editingFood ? "Edit Food Item" : "Create New Food Item"}
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter food name"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            placeholder="Enter food description"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.categoryId}
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Select a category" value="" />
              {categories.map((category) => (
                <Picker.Item
                  key={category._id}
                  label={category.name}
                  value={category._id}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            placeholder="Enter price"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Original Price</Text>
          <TextInput
            style={styles.input}
            value={formData.originalPrice}
            onChangeText={(text) =>
              setFormData({ ...formData, originalPrice: text })
            }
            placeholder="Enter original price"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Image</Text>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>
              {image ? "Change Image" : "Pick an image"}
            </Text>
          </TouchableOpacity>
          {image && (
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          )}

          <Text style={styles.label}>Options</Text>
          {formData.options.map((option, optionIndex) => (
            <View key={optionIndex} style={styles.optionContainer}>
              <View style={styles.optionHeader}>
                <TextInput
                  style={[styles.input, styles.optionInput]}
                  value={option.name}
                  onChangeText={(text) => {
                    const newOptions = [...formData.options];
                    newOptions[optionIndex].name = text;
                    setFormData({ ...formData, options: newOptions });
                  }}
                  placeholder="Option name"
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeOption(optionIndex)}
                >
                  <Icon name="close" size={20} color="#ff4d4f" />
                </TouchableOpacity>
              </View>

              {option.values.map((value, valueIndex) => (
                <View key={valueIndex} style={styles.valueContainer}>
                  <TextInput
                    style={[styles.input, styles.valueInput]}
                    value={value.name}
                    onChangeText={(text) => {
                      const newOptions = [...formData.options];
                      newOptions[optionIndex].values[valueIndex].name = text;
                      setFormData({ ...formData, options: newOptions });
                    }}
                    placeholder="Value name"
                  />
                  <TextInput
                    style={[styles.input, styles.valueInput]}
                    value={value.priceDiff.toString()}
                    onChangeText={(text) => {
                      const newOptions = [...formData.options];
                      newOptions[optionIndex].values[valueIndex].priceDiff =
                        parseInt(text) || 0;
                      setFormData({ ...formData, options: newOptions });
                    }}
                    placeholder="Price difference"
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeValue(optionIndex, valueIndex)}
                  >
                    <Icon name="close" size={20} color="#ff4d4f" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addValueButton}
                onPress={() => addValue(optionIndex)}
              >
                <Text style={styles.addValueButtonText}>Add Value</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addOptionButton} onPress={addOption}>
            <Text style={styles.addOptionButtonText}>Add Option</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {editingFood ? "Update Food Item" : "Create Food Item"}
            </Text>
          </TouchableOpacity>

          {editingFood && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Delete Food Item</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 20,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  imageButton: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  imageButtonText: {
    color: "#666",
    fontSize: 16,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  optionContainer: {
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  optionInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  removeButton: {
    padding: 8,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  valueInput: {
    flex: 1,
    marginRight: 8,
  },
  addValueButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    alignItems: "center",
  },
  addValueButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  addOptionButton: {
    backgroundColor: "#52c41a",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addOptionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#ff4d4f",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#666",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
});

export default AddFood;

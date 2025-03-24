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
      setImage(editingFood.image);
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
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("originalPrice", formData.originalPrice);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("optionsJSON", JSON.stringify(formData.options));

      // Thêm tệp hình ảnh nếu có
      if (image) {
        const imageUri = image; // URI của hình ảnh từ `expo-image-picker`
        const filename = imageUri.split("/").pop(); // Lấy tên tệp
        const match = /\.(\w+)$/.exec(filename); // Xác định loại tệp từ phần mở rộng
        const type = match ? `image/${match[1]}` : `image`;

        const response = await fetch(imageUri); // Fetch blob từ URI
        const blob = await response.blob();

        formDataToSend.append("image", {
          uri: imageUri, // Đường dẫn URI
          name: filename, // Tên tệp
          type: type, // Loại tệp (ví dụ: image/jpeg)
        });
      }

      // Gửi request bằng fetch
      const token = await AsyncStorage.getItem("accessToken");
      console.log("tokenZZZ");
      const response = await fetch("http://127.0.0.1:2003/api/foods", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token, // Thay YOUR_ACCESS_TOKEN bằng token thực tế
          // Không thiết lập Content-Type ở đây
        },
        body: formDataToSend, // Gửi FormData
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Upload thành công:", result);
        Alert.alert(
          "Success",
          editingFood
            ? "Food item updated successfully!"
            : "Food item created successfully!"
        );
      } else {
        console.error("Upload thất bại:", result);
        Alert.alert("Error", result.message || "Failed to upload food item.");
      }

      onCancel(); // Đóng form sau khi thành công
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );
    }
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
            <Image source={{ uri: image }} style={styles.previewImage} />
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

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
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
});

export default AddFood;

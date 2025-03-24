import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const ShopRegistrationScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    shopName: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:2003/api/shops", {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      });

      Alert.alert("Success", "Shop registered successfully!");
      navigation.navigate("ShopManagement");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Register Your Shop</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Shop Name</Text>
        <TextInput
          style={styles.input}
          value={formData.shopName}
          onChangeText={(text) => setFormData({ ...formData, shopName: text })}
          placeholder="Enter shop name"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="Enter shop address"
        />

        <Text style={styles.label}>Latitude</Text>
        <TextInput
          style={styles.input}
          value={formData.latitude}
          onChangeText={(text) => setFormData({ ...formData, latitude: text })}
          placeholder="Enter latitude"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Longitude</Text>
        <TextInput
          style={styles.input}
          value={formData.longitude}
          onChangeText={(text) => setFormData({ ...formData, longitude: text })}
          placeholder="Enter longitude"
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Register Shop</Text>
        </TouchableOpacity>
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
    margin: 20,
    textAlign: "center",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ff4d4f",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ShopRegistrationScreen;

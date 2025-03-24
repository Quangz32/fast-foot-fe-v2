import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { shopService } from "../../../services/shopService";

const ShopRegistrationScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    shopName: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
  };

  const handleSubmit = async () => {
    try {
      // const response = await , {
      //   ...formData,
      //   latitude: parseFloat(formData.latitude),
      //   longitude: parseFloat(formData.longitude),
      // });

      const response = await shopService.registerShop({
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
        {Platform.OS === "web" && (
          <View style={styles.mapContainer}>
            <Text style={styles.label}>Select Location on Map</Text>
            <LoadScript googleMapsApiKey="">
              <GoogleMap
                mapContainerStyle={styles.map}
                center={selectedLocation || { lat: 21.0285, lng: 105.8542 }}
                zoom={13}
                onClick={handleMapClick}
              >
                {selectedLocation && <Marker position={selectedLocation} />}
              </GoogleMap>
            </LoadScript>
          </View>
        )}
        <View style={{ display: "none" }}>
          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={styles.input}
            value={formData.latitude}
            onChangeText={(text) =>
              setFormData({ ...formData, latitude: text })
            }
            placeholder="Enter latitude"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Longitude</Text>
          <TextInput
            style={styles.input}
            value={formData.longitude}
            onChangeText={(text) =>
              setFormData({ ...formData, longitude: text })
            }
            placeholder="Enter longitude"
            keyboardType="numeric"
          />
        </View>
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
  mapContainer: {
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 8,
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

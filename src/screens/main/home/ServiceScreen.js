import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const banners = [
  require("../../../../assets/categories/banh-mi.webp"),
  require("../../../../assets/categories/tra-sua.webp"),
  require("../../../../assets/categories/com.webp"),
];

const services = [
  {
    id: 1,
    name: "Gọi xe ôm",
    icon: "motorbike",
    screen: "BikeService",
  },
  {
    id: 2,
    name: "Đặt đồ ăn",
    icon: "food",
    screen: "Foods",
  },
  {
    id: 3,
    name: "Gửi hàng - Gọi ship",
    icon: "package",
    screen: "Delivery",
  },
  {
    id: 4,
    name: "Gửi hàng liên tỉnh",
    icon: "truck-delivery",
    screen: "InterCityDelivery",
  },
];

const ServiceScreen = ({ navigation }) => {
  const [currentBanner, setCurrentBanner] = useState(0);

  const handleServicePress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../../assets/logo.webp")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>LẤY NHANH - GIAO LẸ</Text>
      </View>

      {/* Banner Slider */}
      <View style={styles.bannerContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slide = Math.round(
              event.nativeEvent.contentOffset.x / Dimensions.get("window").width
            );
            setCurrentBanner(slide);
          }}
        >
          {banners.map((banner, index) => (
            <Image
              key={index}
              source={banner}
              style={styles.banner}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        <View style={styles.pagination}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentBanner === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Location and Voucher Info */}
      <View style={styles.infoContainer}>
        <View style={styles.voucherBadge}>
          <Text style={styles.voucherText}>2 Voucher</Text>
        </View>
        <View style={styles.locationBadge}>
          <Icon name="map-marker" size={16} color="#ff4d4f" />
          <Text style={styles.locationText}>Thạch Thất - Hà Nội</Text>
        </View>
      </View>

      {/* Services Grid */}
      <View style={styles.servicesContainer}>
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceItem}
              onPress={() => handleServicePress(service.screen)}
            >
              <View style={styles.serviceIconContainer}>
                <Icon name={service.icon} size={24} color="#ff4d4f" />
              </View>
              <Text style={styles.serviceName}>{service.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerButtonText}>ĐĂNG KÝ BÁN HÀNG</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  logo: {
    width: 200,
    height: 40,
  },
  subtitle: {
    color: "#ff4d4f",
    fontSize: 14,
    marginTop: 5,
  },
  bannerContainer: {
    height: 200,
    position: "relative",
  },
  banner: {
    width: Dimensions.get("window").width,
    height: 200,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
  },
  infoContainer: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  voucherBadge: {
    backgroundColor: "#fff2f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ff4d4f",
  },
  voucherText: {
    color: "#ff4d4f",
    fontSize: 14,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff2f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  locationText: {
    color: "#ff4d4f",
    marginLeft: 4,
    fontSize: 14,
  },
  servicesContainer: {
    padding: 16,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceItem: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff2f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  registerButton: {
    backgroundColor: "#ff4d4f",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServiceScreen;

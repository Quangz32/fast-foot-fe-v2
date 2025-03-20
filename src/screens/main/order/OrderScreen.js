import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import OrderItem from "./OrderItem";
import { orderService } from "../../../services/orderService";

const ORDER_STATUSES = [
  { id: "creating", label: "Chờ đặt hàng", icon: "clock-outline" },
  { id: "confirmed", label: "Đã đặt", icon: "check-circle-outline" },
  { id: "preparing", label: "Đang chuẩn bị", icon: "food" },
  { id: "delivering", label: "Đang giao", icon: "truck-delivery" },
  { id: "delivered", label: "Đã giao", icon: "package-variant" },
  { id: "completed", label: "Đã nhận", icon: "check-circle" },
  { id: "cancelled", label: "Đã huỷ", icon: "close-circle" },
];

const OrderScreen = () => {
  const [selectedStatus, setSelectedStatus] = useState("creating");
  const [orders, setOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrders();
      console.log("response", response);

      setOrders(response);
      // Calculate counts for each status
      const counts = {};
      response.forEach((order) => {
        counts[order.status] = (counts[order.status] || 0) + 1;
      });
      setStatusCounts(counts);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const filteredOrders = orders?.filter(
    (order) => order.status === selectedStatus
  );


  return (
    <View style={styles.container}>
      {/* Status Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={styles.statusTabsContainer}
      >
        {ORDER_STATUSES.map((status) => (
          <TouchableOpacity
            key={status.id}
            style={[
              styles.statusTab,
              selectedStatus === status.id && styles.selectedStatusTab,
            ]}
            onPress={() => handleStatusChange(status.id)}
          >
            <Icon
              name={status.icon}
              size={24}
              color={selectedStatus === status.id ? "#ff4d4f" : "#666"}
            />
            <Text
              style={[
                styles.statusText,
                selectedStatus === status.id && styles.selectedStatusText,
              ]}
            >
              {status.label}
            </Text>
            {statusCounts[status.id] > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{statusCounts[status.id]}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <OrderItem
            order={item}
          />
        )}
        contentContainerStyle={styles.ordersList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#f5f5f5",
  },
  statusTabsContainer: {
    backgroundColor: "#fff",
    paddingVertical: 8,
  },
  statusTab: {
    height: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  selectedStatusTab: {
    backgroundColor: "#fff2f0",
  },
  statusText: {
    fontSize: 13,
    color: "#666",
  },
  selectedStatusText: {
    color: "#ff4d4f",
    fontWeight: "600",
  },
  badge: {
    backgroundColor: "#ff4d4f",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    paddingHorizontal: 4,
  },
  ordersList: {
    padding: 16,
  },
});

export default OrderScreen;

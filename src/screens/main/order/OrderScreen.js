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
  { id: "placed", label: "Đã đặt", icon: "check-circle-outline" },
  { id: "preparing", label: "Đang chuẩn bị", icon: "food" },
  { id: "delivering", label: "Đang giao", icon: "truck-delivery" },
  { id: "delivered", label: "Đã giao", icon: "package-variant" },
  { id: "received", label: "Đã nhận", icon: "check-circle" },
  { id: "cancelled", label: "Đã huỷ", icon: "close-circle" },
];

const OrderScreen = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = useState("creating");
  const [orders, setOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});

  useEffect(() => {
    return navigation.addListener("focus", () => {
      fetchOrders();
    });
  }, [navigation]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrders();
      console.log(response);
      setOrders(response);
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
      <View style={styles.statusTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} // Không hiển thị thanh cuộn ngang
          contentContainerStyle={styles.scrollContent}
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
                  <Text style={styles.badgeText}>
                    {statusCounts[status.id]}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <OrderItem order={item} fetchOrders={fetchOrders} />
        )}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={true} // Hiện thanh cuộn dọc
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  statusTabsContainer: {
    height: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 8,
    flexDirection: "row", // Đảm bảo các phần tử xếp theo hàng ngang
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
    paddingHorizontal: 16, // Căn chỉnh danh sách
    paddingBottom: 16, // Thêm khoảng trống cuối để cuộn dễ hơn
  },
  flatList: {
    flex: 1, // Đảm bảo FlatList chiếm không gian còn lại
  },
});

export default OrderScreen;

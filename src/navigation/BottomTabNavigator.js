import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "../screens/main/home/HomeScreen";
import OrderScreen from "../screens/main/order/OrderScreen";
import ReviewOrderScreen from "../screens/main/order/ReviewOrderScreen";
import MessageScreen from "../screens/main/message/MessageScreen";
import ProfileScreen from "../screens/main/user/ProfileScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

// Navigator riêng cho phần Order để có thể thêm màn hình Review
const OrderNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrderList"
        component={OrderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewOrder"
        component={ReviewOrderScreen}
        options={{
          title: "Đánh giá đơn hàng",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#ff4d4f",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Trang chủ",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="rocket" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderNavigator}
        options={{
          title: "Đơn hàng",
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Icon name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageScreen}
        options={{
          title: "Tin nhắn",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="message" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Tài khoản",
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

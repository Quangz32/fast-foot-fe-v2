import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "../screens/main/home/HomeScreen";
import ServiceScreen from "../screens/main/home/ServiceScreen";
import FoodsScreen from "../screens/main/home/FoodsScreen";
import OrdersScreen from "../screens/main/order/OrdersScreen";
import NotificationsScreen from "../screens/main/notification/NotificationsScreen";
import ProfileScreen from "../screens/main/user/ProfileScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

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
        component={OrdersScreen}
        options={{
          title: "Lịch sử",

          tabBarIcon: ({ color, size }) => (
            <Icon name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: "Thông báo",
          tabBarIcon: ({ color, size }) => (
            <Icon name="bell" size={size} color={color} />
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

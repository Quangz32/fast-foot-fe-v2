import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import ServiceScreen from "./ServiceScreen";
import RecommendScreen from "./FoodRecommendScreen";
import FoodDetailScreen from "./FoodDetailScreen";
import FoodsScreen from "./FoodsScreen";
import ShopRegistrationScreen from "../shop/ShopRegistrationScreen";
import ShopManagementScreen from "../shop/ShopManagementScreen";

const Stack = createStackNavigator();
const HomeScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Services"
        component={ServiceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Recommend"
        component={RecommendScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Foods"
        component={FoodsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FoodDetail"
        component={FoodDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShopRegistration"
        component={ShopRegistrationScreen}
        options={{
          title: "Đăng ký bán hàng",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ShopManagement"
        component={ShopManagementScreen}
        options={{
          title: "Quản lý shop",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;

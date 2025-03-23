import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import ServiceScreen from "./ServiceScreen";
import RecommendScreen from "./FoodRecommendScreen";
import FoodDetailScreen from "./FoodDetailScreen";
import FoodsScreen from "./FoodsScreen";

import { useNavigation } from "@react-navigation/native";
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

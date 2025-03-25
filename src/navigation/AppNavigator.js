import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import BottomTabNavigator from "../../src/navigation/BottomTabNavigator";
import ShopRegistrationScreen from "../screens/main/shop/ShopRegistrationScreen";
import ShopManagementScreen from "../screens/main/shop/ShopManagementScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

      {/* <Stack.Screen
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
      /> */}
    </Stack.Navigator>
  );
};

export default AppNavigator;

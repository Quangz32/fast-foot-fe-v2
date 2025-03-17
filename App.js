import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/navigation/AppNavigator";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <PaperProvider>
          <AppNavigator />
          <Toast />
        </PaperProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

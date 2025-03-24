import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/navigation/AppNavigator";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  // delete token in async storage
  AsyncStorage.removeItem("accessToken");
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

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ExploreScreen from "../screens/ExploreScreen";
import StockDetailsScreen from "../screens/StockDetailsScreen";
import SplashScreen from "../screens/SplashScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }} // Hide the header for the splash screen
      />
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="StockDetails" component={StockDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

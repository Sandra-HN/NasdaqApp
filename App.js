import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import AppNavigator from "./navigation/AppNavigator";

const queryClient = new QueryClient();

export default class App extends React.Component {
  state = {
    fontsLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      "DMSans-Regular": require("./assets/fonts/DMSans-Regular.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  render() {
    if (!this.state.fontsLoaded) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#1F202F",
            color: "#ffffff",
          }}
        >
          <ActivityIndicator size="large" color="#323443" />
        </View>
      );
    }
    return (
      <NavigationContainer>
        <QueryClientProvider client={queryClient}>
          <AppNavigator />
        </QueryClientProvider>
      </NavigationContainer>
    );
  }
}

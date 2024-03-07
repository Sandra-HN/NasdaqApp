import * as Font from "expo-font";
import React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
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
        <AppNavigator />
      </NavigationContainer>
    );
  }
}

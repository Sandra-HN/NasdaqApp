import React from "react";
import { Image, StyleSheet } from "react-native";

const LogoTitle = () => {
  return (
    <Image source={require("../assets/nasdaq-logo.png")} style={styles.logo} />
  );
};
const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 30,
    marginLeft: 40,
    resizeMode: "contain",
    tintColor: "#FFFFFF",
  },
});
export default LogoTitle;

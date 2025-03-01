import React from "react";
import { StyleSheet, View, Image, Text, ActivityIndicator } from "react-native";
import { useTheme } from "../../../src/context/useThemeContext";
import { ThemeColor } from "../../services/props";
import Logo from "../../images/logoLogin.png";

export function InitialScreen() {
  const { ColorTheme } = useTheme();

  const styles = createStyles(ColorTheme);

  return (
    <View style={styles.container}>
      <Image style={{ width: "23%", resizeMode: "contain" }} source={Logo} />
      <Text style={styles.nameText}>Dota Statistics</Text>
      <ActivityIndicator color={"#fff"} size={"large"} />
    </View>
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.dark,
      justifyContent: "center",
      alignItems: "center",
    },
    nameText: {
      fontFamily: "QuickSand-Bold",
      fontSize: 15,
      color: "#fff",
      marginBottom: "15%",
    },
  });

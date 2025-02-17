import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";

export function ModalLoading() {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator style={{}} size={30} color={ColorTheme.semilight} />
      <Text style={styles.text}>
        {englishLanguage ? "Loading..." : "Carregando"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.8)",

    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {},
  text: {
    color: "#fff",
    padding: "2%",
    fontFamily: "QuickSand-Semibold",
    //flex: 0.5,
  },
});

import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "@src/context/useThemeContext";
import { TextComponent } from "../TextComponent";
import { useSettingsStore } from "@src/store/settings";

export function ModalLoading() {
  const { englishLanguage } = useSettingsStore();
  const { ColorTheme } = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator style={{}} size={30} color="#fff" />
      <TextComponent weight="bold" style={styles.text}>
        {englishLanguage ? "Loading..." : "Carregando"}
      </TextComponent>
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
    //flex: 0.5,
  },
});

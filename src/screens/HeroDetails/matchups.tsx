import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemeColor } from "../../../src/services/props";
import { useTheme } from "../../../src/context/useThemeContext";

export function HeroDetails() {
  const { ColorTheme } = useTheme();

  const styles = createStyles(ColorTheme);
  return <View style={styles.container}></View>;
}

const createStyles = (Colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#cece",
    },
  });

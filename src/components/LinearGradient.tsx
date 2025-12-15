import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";

type Props = {
  noBorderRadius?: boolean;
};

export function LinearGradientComponent({ noBorderRadius }: Props) {
  return (
    <LinearGradient
      colors={["rgba(0,0,0,0.7)", "transparent"]}
      style={[styles.background, { borderRadius: noBorderRadius ? 0 : 5 }]}
    />
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "90%",
    borderRadius: 5,
  },
});

import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

type FontWeight = "regular" | "semibold" | "bold";

type Props = {
  weight?: FontWeight;
  style: StyleProp<TextStyle>;
  children: React.ReactNode;
};

export function TextComponent({ children, weight = "regular", style }: Props) {
  const fontMap = {
    regular: "QuickSand-Regular",
    semibold: "QuickSand-Semibold",
    bold: "QuickSand-Bold",
  };

  return (
    <Text style={[{ fontFamily: fontMap[weight] }, style]}>{children}</Text>
  );
}

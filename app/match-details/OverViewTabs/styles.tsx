import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor } from "../../../src/services/props";

const { width } = Dimensions.get("window");

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    containerItem: {
      width: "95%",
      alignSelf: "center",
      marginBottom: "3%",
      borderRadius: 9,
      backgroundColor: "#fff",
      elevation: 7,
    },
    title: {
      fontSize: width * 0.05,
      color: colors.semidark,
      textAlign: "center",
      fontFamily: "QuickSand-Semibold",
    },
    detailsContainer: {
      width: "100%",
      alignItems: "center",
      padding: "1%",
      borderRadius: 5,
    },
    detailsContent: {
      width: "48%",
    },
    textTitle: {
      fontSize: width * 0.035,
      color: colors.semidark,
      padding: "1%",
      textAlign: "center",
      fontFamily: "QuickSand-Semibold",
    },
    barRadiant: {
      backgroundColor: "#018c3b",
      margin: "1%",
      borderRadius: 3,
    },
    textResult: {
      fontSize: width * 0.03,
      alignSelf: "center",
      color: "#888",
      fontFamily: "QuickSand-Semibold",
    },
    barDire: {
      backgroundColor: "#981a33",
      margin: "1%",
      borderRadius: 3,
    },
    imageHeroItems: {
      width: "100%",
      aspectRatio: 1.5,
      alignSelf: "center",
      borderRadius: 7,
    },
  });

import { StyleSheet } from "react-native";
import { FontModel, ThemeColor } from "../../services/props";

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      backgroundColor: "#ddd",
    },
    containerCards: {
      alignSelf: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      marginVertical: "1%",
      width: "95%",
      borderRadius: 3,
      padding: "3%",
    },
    textLeagueName: {
      fontFamily: "QuickSand-Bold",
      color: colors.semidark,
      textAlign: "center",
    },
  });

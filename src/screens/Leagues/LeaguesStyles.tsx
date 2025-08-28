import { StyleSheet } from "react-native";
import { FontModel, ThemeColor } from "../../services/props";

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    containerCards: {
      alignSelf: "center",
      backgroundColor: "#fff",
      marginVertical: "1%",
      width: "95%",
      borderRadius: 3,
      padding: "3%",
      elevation: 5,
      borderLeftWidth: 5,
      borderLeftColor: colors.standard,
    },
    textLeagueName: {
      fontFamily: "QuickSand-Bold",
      color: colors.semidark,
      textAlign: "center",
    },
  });

import { StyleSheet } from "react-native";
import { ThemeColor } from "../../services/props";

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
    },
    textbutton: {
      textAlign: "center",
      fontFamily: "QuickSand-Semibold",
      color: "#fff",
    },
    erroMessage: {
      alignItems: "center",
      justifyContent: "center",
      flex: 0.7,
    },
    textErro: {
      textAlign: "center",
      width: "90%",
      fontWeight: "bold",
      color: "orange",
      fontSize: 20,
    },
    textLoading: {
      fontFamily: "QuickSand-Bold",
      fontSize: 15,
      color: colors.dark,
      marginBottom: "1%",
    },
  });

import { StyleSheet } from "react-native";
import { ThemeColor } from "../../services/props";

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingTop: 5,
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
      padding: "5%",
      fontFamily: "QuickSand-Semibold",
      color: colors.semidark,
    },
    textLoading: {
      fontFamily: "QuickSand-Bold",
      fontSize: 15,
      color: colors.dark,
      marginBottom: "1%",
    },
  });

import { StyleSheet } from "react-native";
import { ThemeColor } from "../../services/props";

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    textbutton: {
      textAlign: "center",
      fontFamily: "QuickSand-Semibold",
      color: "#fff",
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
    textInput: {
      backgroundColor: "#fff",
      textAlign: "center",
      fontFamily: "QuickSand-Semibold",
      flexGrow: 1,
      marginHorizontal: "5%",
    },
    inputContainer: {
      marginTop: "3%",
      width: "95%",
      alignItems: "center",
      justifyContent: "space-around",
    },
  });

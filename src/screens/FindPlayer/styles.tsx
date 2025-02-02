import { StyleSheet } from "react-native";
import { ThemeColor } from "../../services/props";

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    inputContainer: {
      marginTop: "3%",
      width: "95%",
      alignItems: "center",
      justifyContent: "space-around",
      flexDirection: "row",
    },
    textInput: {
      backgroundColor: "#fff",
      textAlign: "center",
      fontFamily: "QuickSand-Semibold",
      flexGrow: 1,
      marginHorizontal: "5%",
    },
    buttonCleanSearch: {
      marginTop: "5%",
      backgroundColor: colors.semidark,
      padding: "2.7%",
      alignItems: "center",
      borderRadius: 5,
    },
    textButton: {
      fontFamily: "QuickSand-Semibold",
      color: "#fff",
    },
    bodyContainer: {
      // flex: 1,
      width: "100%",
    },
    textMessage: {
      textAlign: "center",
      padding: "5%",
      fontFamily: "QuickSand-Semibold",
      color: colors.semidark,
    },
  });

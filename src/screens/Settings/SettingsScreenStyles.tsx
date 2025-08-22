import { StyleSheet } from "react-native";
import { ThemeColor } from "../../services/props";

export const createStyles = (Colors: ThemeColor) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    container: {
      alignItems: "center",
      margin: "1%",
      width: "100%",
      padding: "3%",
    },
    title: {
      fontFamily: "QuickSand-Bold",
      padding: "3%",
      fontSize: 20,
      color: "orange",
      textAlign: "center",
    },
    textAlert: {
      fontFamily: "QuickSand-Semibold",
      color: "#e15a5a",
      textAlign: "center",
      marginVertical: 15,
    },
    profile: {
      fontFamily: "QuickSand-Bold",
      textAlign: "left",
      width: "100%",
      color: Colors.dark,
    },
    textData: {
      color: "#000",
      fontFamily: "QuickSand-Regular",
    },
    textOptions: {
      fontFamily: "QuickSand-Bold",
      color: "#888",
    },
    buttonContainer: {
      flex: 0.1,
      alignItems: "center",
      width: "100%",
    },
    options: {
      width: "100%",
      justifyContent: "space-between",
    },
    textButton: {
      fontSize: 15,
      fontFamily: "QuickSand-Semibold",
      color: Colors.dark,
    },
    buttonSave: {
      //backgroundColor: Colors.standard,
      backgroundColor: Colors.light,
      elevation: 7,
      padding: "2%",
      width: "45%",
      alignItems: "center",
      borderTopStartRadius: 15,
      borderTopEndRadius: 15,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
      borderWidth: 1,
      borderColor: Colors.dark,
    },
  });

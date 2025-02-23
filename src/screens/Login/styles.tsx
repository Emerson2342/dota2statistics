import { StyleSheet } from "react-native";
import { ThemeColor } from "../../services/props";

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.dark,
      justifyContent: "center",
      width: "100%",
      alignItems: "center",
    },
    headerContainer: {
      flex: 0.3,
      justifyContent: "center",
      width: "100%",
      alignItems: "center",
    },
    nameText: {
      fontFamily: "QuickSand-Bold",
      fontSize: 15,
      color: "#fff",
    },
    buttonContainer: {
      flex: 0.7,
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      borderTopEndRadius: 50,
      borderTopStartRadius: 50,
      backgroundColor: "#fff",
    },
    textContainer: {
      //backgroundColor: "red",
      width: "80%",
      marginTop: "3%",
    },
    titleText: {
      color: colors.semidark,
      fontFamily: "QuickSand-Bold",
      fontSize: 23,
    },
    signupText: {
      fontFamily: "QuickSand-Semibold",
      color: "#888",
    },
    inputContainer: {
      width: "100%",
      alignItems: "center",
      marginTop: "3%",
    },
    textLabel: {
      width: "80%",
      alignContent: "flex-start",
      fontFamily: "QuickSand-Semibold",
      color: "#888",
      marginLeft: "1%",
    },
    textInput: {
      width: "80%",
      backgroundColor: "#f5f5f5",
      // marginTop: "3%",
      height: 40,
      color: colors.semidark,
      borderRadius: 3,
      borderBottomWidth: 1,
      borderColor: "#888",
      fontFamily: "QuickSand-Semibold",
    },
    button: {
      marginTop: "3%",
      width: "55%",
      backgroundColor: colors.semidark,
      padding: "1%",
      borderTopStartRadius: 15,
      borderTopEndRadius: 15,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
      elevation: 7,
      alignItems: "center",
    },
    textButton: {
      fontSize: 15,
      fontFamily: "QuickSand-Bold",
      color: "#fff",
      padding: "1.5%",
    },
    textAboutUs: {
      marginVertical: 17,
      fontFamily: "QuickSand-Semibold",
      color: "#aaa",
    },
  });

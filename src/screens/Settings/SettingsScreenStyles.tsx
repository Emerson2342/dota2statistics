import { StyleSheet } from "react-native";
import { ThemeColor } from "../../services/props";

export const createStyles = (Colors: ThemeColor) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
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
      fontSize: 15,
      fontFamily: "QuickSand-Bold",
      textAlign: "left",
      width: "100%",
      paddingLeft: "5%",
      paddingRight: "5%",
      color: Colors.dark,
    },
    textData: {
      color: "#000",
      fontFamily: "QuickSand-Regular",
    },
    optionsContainer: {
      //padding: '5%',
      width: "100%",
      borderTopWidth: 1,
      borderColor: Colors.standard,
    },

    textOptions: {
      fontFamily: "QuickSand-Bold",
      color: "#888",
    },
    buttonContainer: {
      marginBottom: "7%",
      alignItems: "center",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-around",
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

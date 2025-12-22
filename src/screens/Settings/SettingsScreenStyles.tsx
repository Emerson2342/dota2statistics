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
      padding: "3%",
      fontSize: 20,
      color: "orange",
      textAlign: "center",
    },
    textAlert: {
      color: "#e15a5a",
      textAlign: "center",
      marginVertical: 15,
    },
    profile: {
      flexDirection: "row",
      width: "100%",
      color: Colors.dark,
      gap: 3,
    },
    textData: {
      color: "#000",
    },
    textOptions: {
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
      color: Colors.dark,
    },
    buttonSave: {
      backgroundColor: Colors.light,
      padding: "2%",
      width: "45%",
      alignItems: "center",
      borderRadius: 7,
      borderWidth: 1,
      borderColor: Colors.dark,
    },
  });

import { StyleSheet } from "react-native";
import { ThemeColor } from "@src/services/props";

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    inputContainer: {
      marginVertical: "3%",
      alignItems: "center",
      flexDirection: "row",
    },
    buttonSearch: {
      padding: 7,
      width: "50%",
      alignItems: "center",
      borderRadius: 7,
      borderWidth: 1,
      borderColor: colors.semidark,
    },
    buttonCleanSearch: {
      marginTop: "5%",
      backgroundColor: colors.semidark,
      padding: "3%",
      alignItems: "center",
      borderRadius: 5,
    },
    emptyList: {
      marginTop: "3%",
      textAlign: "center",
      color: colors.semidark,
    },
  });

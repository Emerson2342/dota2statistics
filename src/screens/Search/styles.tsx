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
      marginTop: "3%",
      width: "95%",
      alignItems: "center",
      justifyContent: "space-around",
      flexDirection: "row",
    },
    buttonCleanSearch: {
      marginTop: "5%",
      backgroundColor: colors.semidark,
      padding: "2.7%",
      alignItems: "center",
      borderRadius: 5,
    },
    emptyList: {
      textAlign: "center",
      padding: "5%",
      color: colors.semidark,
    },
  });

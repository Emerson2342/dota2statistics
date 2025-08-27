import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor } from "../../services/props";

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: colors.light,
    },
    carregando: {
      color: "#fff",
      fontSize: 20,
      textAlign: "center",
      fontWeight: "bold",
      flex: 0.9,
    },
    textButtonModal: {
      fontSize: 15,
      textAlign: "center",
      fontWeight: "bold",
    },
    buttonFechar: {
      width: "50%",
      alignSelf: "center",
      flexDirection: "row",
      borderRadius: 7,
      backgroundColor: "orange",
      borderWidth: 1,
      padding: 7,
      justifyContent: "center",
    },
    textButton: {
      fontSize: 15,
      letterSpacing: 1,
      fontWeight: "bold",
      textAlign: "center",
    },
    textNome: {
      fontSize: 15,
      fontWeight: "bold",
      color: "#fff",
    },
    playerDestaque: {
      width: "100%",
    },
    matchIdContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    textMatchId: {
      fontFamily: "QuickSand-Semibold",
      color: colors.semidark,
      textAlign: "center",
    },
  });

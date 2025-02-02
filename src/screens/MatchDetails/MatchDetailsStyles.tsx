import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor } from "../../services/props";

const { width } = Dimensions.get("window");

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: "#ddd",
    },
    carregando: {
      color: "#fff",
      fontSize: 20,
      textAlign: "center",
      fontWeight: "bold",
      flex: 0.9,
    },
    textTitle: {
      fontSize: width * 0.035,
      color: colors.semidark,
      padding: "1%",
      textAlign: "center",
      fontFamily: "QuickSand-Semibold",
    },
    textResult: {
      fontSize: width * 0.03,
      alignSelf: "center",
      color: "#888",
      fontFamily: "QuickSand-Semibold",
    },
    textButtonModal: {
      fontSize: 15,
      textAlign: "center",
      fontWeight: "bold",
    },
    containerItem: {
      width: "95%",
      alignSelf: "center",
      marginBottom: "3%",
      borderRadius: 9,
      backgroundColor: "#fff",
    },
    detailsContainer: {
      width: "100%",
      alignItems: "center",
      padding: "1%",
      borderRadius: 5,
    },
    detailsContent: {
      width: "48%",
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
    title: {
      fontSize: width * 0.05,
      color: colors.semidark,
      textAlign: "center",
      fontFamily: "QuickSand-Semibold",
    },

    imageHeroItems: {
      width: "100%",
      aspectRatio: 1.5,
      alignSelf: "center",
      borderRadius: 7,
    },

    barRadiant: {
      backgroundColor: "#018c3b",
      margin: "1%",
      borderRadius: 3,
    },
    barDire: {
      backgroundColor: "#981a33",
      margin: "1%",
      borderRadius: 3,
    },
  });

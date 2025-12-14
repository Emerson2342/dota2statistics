import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor } from "../../services/props";

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "97%",
      alignSelf: "center",
      alignItems: "center",
    },
    inputContainer: {
      alignItems: "center",
      flexDirection: "row",
      width: "95%",
      justifyContent: "center",
    },
    textInput: {
      backgroundColor: "#fff",
      textAlign: "center",
      fontFamily: "QuickSand-Semibold",
      margin: "3%",
    },
    buttonClearSearch: {
      backgroundColor: colors.semidark,
      alignItems: "center",
      borderRadius: 3,
      marginTop: "1%",
      marginBottom: "1%",
      padding: "2.1%",
    },
    radioButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "97%",
      marginTop: "3%",
      marginBottom: "3%",
    },
    buttonOptions: {
      width: "15%",
      alignItems: "center",
      borderRadius: 5,
      padding: 5,
      borderColor: colors.standard,
    },
    radioButtonContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    textAll: {
      textAlign: "center",
      height: 27,
      fontSize: 15,
    },
    heroList: {
      width: "45%",
      backgroundColor: "#fff",
      padding: "0.5%",
      margin: "1%",
      borderRadius: 23,
    },
    image: {
      alignSelf: "center",
      width: Dimensions.get("screen").width * 0.1,
      height: Dimensions.get("screen").width * 0.065,
      borderRadius: 23,
    },
    imageRadioButton: {
      width: 27,
      height: 27,
    },
    nameHeroText: {
      color: colors.semidark,
      textAlign: "left",
      fontSize: Dimensions.get("screen").width * 0.03,
      width: "100%",
    },
  });

import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor } from "../../../services/props";

export const createStylesStatics = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      width: "95%",
      borderRadius: 7,
      alignSelf: "center",
    },
    textHeader: {
      fontSize: Dimensions.get("screen").width * 0.05,
      textAlign: "center",
      fontFamily: "QuickSand-Bold",
      color: "#fff",
      alignSelf: "center",
      borderRadius: 7,
      padding: 3,
      margin: 3,
      width: "90%",
      backgroundColor: colors.semidark,
    },
    titleContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    content: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      flex: 1,
    },
    matchContainer: {
      width: "97%",
      alignSelf: "center",
      backgroundColor: "#fff",
      borderColor: colors.standard,
      elevation: 3,
      borderLeftWidth: 5,

      borderRadius: 5,
      marginTop: "1.7%",
      paddingVertical: "1%",
    },
    leagueName: {
      fontFamily: "QuickSand-Bold",
      color: colors.dark,
      fontSize: Dimensions.get("window").width * 0.037,
      textAlign: "center",
      flexWrap: "nowrap",
      width: "100%",
    },
    teamRow: {
      flexDirection: "row",
      alignItems: "center",
      width: "50%",
    },
    score: {
      width: "13%",
      textAlign: "center",
      fontFamily: "QuickSand-Semibold",
      fontSize: 11.3,
    },
    teamName: {
      width: "87%",
      fontFamily: "QuickSand-Semibold",
      fontSize: Dimensions.get("screen").width * 0.037,
      textAlign: "center",
    },
    linkContainer: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
    },
    buttonContainer: {
      backgroundColor: `${colors.light}`,
      alignItems: "center",
      width: "75%",
      borderRadius: 5,
      marginBottom: "1.7%",
    },
    textButton: {
      fontFamily: "QuickSand-Bold",
      color: colors.semidark,

      padding: "1.5%",
      fontSize: Dimensions.get("screen").width * 0.027,
    },
    timeContainer: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-around",
    },
    textData: {
      fontFamily: "QuickSand-Semibold",
      fontSize: Dimensions.get("screen").width * 0.03,
    },
    textLoading: {
      fontFamily: "QuickSand-Bold",
      fontSize: 15,
      color: colors.dark,
      marginBottom: "1%",
    },
  });

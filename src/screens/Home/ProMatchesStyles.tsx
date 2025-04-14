import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor } from "../../services/props";

export const createStylesStatics = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      //justifyContent: "space-around",
      width: "100%",
    },
    textHeader: {
      fontSize: Dimensions.get("screen").width * 0.04,
      textAlign: "center",
      fontFamily: "QuickSand-Bold",
      color: "#fff",
      padding: 3,
      marginVertical: "2%",
      paddingHorizontal: "7%",
      borderRadius: 7,
      backgroundColor: colors.semidark,
      alignSelf: "center",
    },
    titleContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    textTitle: {
      fontFamily: "QuickSand-Semibold",
      color: "#fff",
      fontSize: 20,
      textAlign: "center",
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
      margin: "1%",
      backgroundColor: "#fff",
      borderRadius: 7,
      paddingTop: "1.7%",
      paddingBottom: "1.7%",
    },
    leagueName: {
      fontFamily: "QuickSand-Bold",
      color: colors.dark,
      fontSize: Dimensions.get("window").width * 0.037,
      textAlign: "center",
      flexWrap: "nowrap",
      borderBottomColor: "#ddd",
      borderBottomWidth: 1,
      width: "100%",
    },
    teamRow: {
      flexDirection: "row",
      alignItems: "center",
      //marginBottom: "1%",
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
      backgroundColor: "orange",
      alignItems: "center",
      width: "75%",
      borderRadius: 5,
      marginBottom: "1.7%",
    },
    textButton: {
      fontFamily: "QuickSand-Semibold",
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

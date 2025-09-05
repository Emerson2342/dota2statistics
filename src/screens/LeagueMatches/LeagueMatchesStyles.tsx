import { Dimensions, StyleSheet } from "react-native";
import { FontModel, ThemeColor } from "../../services/props";

export const createStyles = (Color: ThemeColor) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      flex: 1,
      width: "100%",
      //  backgroundColor: Color.light,
    },
    containerEmpty: { flex: 1, justifyContent: "center", alignItems: "center" },
    titleText: {
      fontSize: 20,
      fontFamily: "QuickSand-Bold",
      textAlign: "center",
      color: Color.semidark,
      margin: "3%",
    },
    emptyText: {
      fontFamily: "QuickSand-Semibold",
      color: Color.semidark,
      fontSize: Dimensions.get("screen").width * 0.04,
    },
    matchesGroup: {
      alignSelf: "center",
      width: "98%",
      backgroundColor: "#fff",
      marginBottom: 15,
      padding: "1%",
      borderRadius: 3,
      elevation: 5,
      borderLeftWidth: 5,
      borderLeftColor: Color.standard,
    },
    teamContainer: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-around",
    },
    resultContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      //
    },
    textResult: {
      width: "40%",
      textAlign: "center",
      color: "#aaa",
      fontFamily: "QuickSand-Bold",
    },
    teamName: {
      width: "80%",
      textAlign: "center",
      fontFamily: "QuickSand-Bold",
    },
    teamScore: {
      width: "15%",
      textAlign: "center",
      fontSize: 13,
      fontFamily: "QuickSand-Bold",
    },
    imageContainer: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-evenly",
    },
    imageTeam: {
      width: "100%",
      aspectRatio: 1,
      resizeMode: "contain",
      backgroundColor: "#000",
    },
    singleTeamContainer: {
      width: "50%",
      flexDirection: "row",
    },

    timeContent: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    durationText: {
      textAlign: "center",
      fontFamily: "QuickSand-Bold",
      color: "#aaaaaa",
      fontSize: 13,
    },
    dataText: {},
  });

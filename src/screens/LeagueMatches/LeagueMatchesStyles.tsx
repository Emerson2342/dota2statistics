import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor } from "@src/services/props";

export const createStyles = (Color: ThemeColor) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      flex: 1,
      width: "100%",
    },
    containerEmpty: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    titleText: {
      fontSize: 20,
      textAlign: "center",
      color: Color.semidark,
      margin: "3%",
    },
    emptyText: {
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
    teamName: {
      width: "80%",
      textAlign: "center",
    },
    teamScore: {
      width: "15%",
      textAlign: "center",
      fontSize: 13,
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
      color: "#aaaaaa",
      fontSize: 13,
    },
  });

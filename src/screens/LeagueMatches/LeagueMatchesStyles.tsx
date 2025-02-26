import { StyleSheet } from "react-native";
import { FontModel, ThemeColor } from "../../services/props";

export const createStyles = (Color: ThemeColor, Font: FontModel) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      flex: 1,
      width: "100%",
      backgroundColor: Color.light,
    },
    titleText: {
      fontSize: 20,
      fontFamily: Font.font2,
      textAlign: "center",
      color: Color.semidark,
      margin: "3%",
    },
    matchesGroup: {
      alignSelf: "center",
      width: "98%",
      backgroundColor: "#fff",
      marginBottom: "2.3%",
      padding: "1%",
      borderRadius: 3,
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
      color: "#169c16",
      fontFamily: Font.font2,
    },
    teamName: {
      width: "80%",
      textAlign: "center",
      fontSize: 13,
      fontFamily: Font.font2,
      color: Color.semidark,
    },
    teamScore: {
      width: "15%",
      textAlign: "center",
      fontSize: 13,
      fontFamily: Font.font2,
      color: Color.semidark,
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
      fontFamily: Font.font1,
      color: "orange",
      fontSize: 13,
    },
    dataText: {},
  });

import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor } from "@src/services/props";

const fontSizeHeader = Dimensions.get("screen").width * 0.05;
const fontSizeLeagueName = Dimensions.get("window").width * 0.037;
const fontSizeButton = Dimensions.get("screen").width * 0.027;

export const createStylesStatics = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      width: "95%",
      maxWidth: 650,
      borderRadius: 7,
      alignSelf: "center",
    },
    textHeader: {
      fontSize: fontSizeHeader > 20 ? 20 : fontSizeHeader,
      textAlign: "center",
      color: colors.semidark,
      alignSelf: "center",
    },
    matchContainer: {
      alignSelf: "center",
      backgroundColor: "#fff",
      borderColor: colors.standard,
      elevation: 3,
      borderLeftWidth: 5,
      borderRadius: 5,
      marginTop: 7,
      paddingVertical: 3,
    },
    leagueName: {
      color: colors.dark,
      fontSize: fontSizeLeagueName > 20 ? 20 : fontSizeLeagueName,
      textAlign: "center",
      flexWrap: "nowrap",
      flex: 1,
    },
    teamRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    score: {
      //width: "13%",
      flex: 1,
      textAlign: "center",
      fontSize: fontSizeButton > 15 ? 15 : fontSizeButton,
    },
    teamName: {
      // width: "87%",
      flex: 5,
      fontSize: fontSizeLeagueName > 20 ? 20 : fontSizeLeagueName,
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
      paddingHorizontal: 35,
      borderRadius: 5,
      marginBottom: 5,
    },
    textButton: {
      color: colors.semidark,
      padding: 3,
      fontSize: fontSizeButton > 15 ? 15 : fontSizeButton,
    },
    timeContainer: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-around",
    },
    textData: {
      fontSize: fontSizeButton > 15 ? 15 : fontSizeButton,
    },
  });

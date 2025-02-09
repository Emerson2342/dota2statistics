import { StyleSheet } from "react-native";
import { ThemeColor } from "../../../src/services/props";

export const createStyles = (Colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: Colors.light,
    },
    scrollView: {
      //paddingTop: "7%"
    },
    itemContent: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 5,
      width: "90%",
      alignSelf: "center",
      justifyContent: "space-around",
      marginVertical: "0.5%",
    },
    imgContainer: {
      flexDirection: "row",
      width: "30%",
      justifyContent: "space-around",
      alignItems: "center",
    },
    imageMedal: {
      width: "43%",
      aspectRatio: 1,
    },
    rankText: {
      color: "#fff",
      position: "absolute",
      left: 13.7,
      top: 32.7,
      width: "27%",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 7,
    },
    imageProfile: {
      width: "37%",
      aspectRatio: 1,
      borderRadius: 9,
    },
    textProfileName: {
      width: "55%",
      fontFamily: "QuickSand-Semibold",
    },
  });

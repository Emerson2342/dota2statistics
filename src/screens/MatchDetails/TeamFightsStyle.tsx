import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor } from "../../../src/services/props";

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {},
    textTime: {
      fontFamily: "QuickSand-Bold",
      color: "orange",
      textAlign: "center",
    },
    headerContainer: {
      flexDirection: "row",
      alignSelf: "flex-end",
      width: "87%",
      alignItems: "baseline",
      marginTop: 3,
      marginBottom: 3,
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    renderItemContainer: {
      backgroundColor: "#fff",
      margin: "1.7%",
      padding: "1.7%",
      borderRadius: 9,
      elevation: 7,
    },
    textTeam: {
      fontFamily: "QuickSand-Bold",
      textAlign: "center",
      marginTop: 7,
      marginBottom: 7,
    },
    containerImage: {
      flexDirection: "row",
    },
    itemImage: {
      width: Dimensions.get("window").width * 0.067,
      aspectRatio: 1,
      borderRadius: 3,
      margin: Dimensions.get("screen").width * 0.003,
    },
    textLabel: {
      fontFamily: "QuickSand-Bold",
      fontSize: Dimensions.get("screen").width * 0.03,
      textAlign: "center",
      color: colors.semidark,
    },
    textTitle: {
      fontFamily: "QuickSand-Bold",
      fontSize: Dimensions.get("screen").width * 0.04,
      // padding: 3,
      color: colors.semidark,
      textAlign: "center",
    },
  });

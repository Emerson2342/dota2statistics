import { Dimensions, StyleSheet } from "react-native";
import { FontModel, ThemeColor } from "../../../services/props";

const width = Dimensions.get("screen").width;

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    listContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      alignItems: "center",
    },
    imageHero: {
      width: "13%",
      aspectRatio: 1.7,
      resizeMode: "contain",
      borderRadius: 3,
    },
    flatListContainer: {
      flex: 1,
      marginBottom: "1%",
      paddingLeft: "1%",
      paddingRight: "1%",
      alignSelf: "center",
    },
    textTitleHeader: {
      color: colors.light,
      textAlign: "center",
      fontSize: Dimensions.get("screen").width * 0.03,
    },
    listTitle: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    textList: {
      color: colors.semidark,
      textAlign: "center",
      alignSelf: "center",
      fontSize: width * 0.03,
    },
  });

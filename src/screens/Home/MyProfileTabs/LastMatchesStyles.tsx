import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor } from "@src/services/props";

const fontSize = Dimensions.get("screen").width * 0.03;
const imgWidth = Dimensions.get("screen").width * 0.05;

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    listContainer: {
      //flex: 1,
      paddingHorizontal: 3,
      flexDirection: "row",
      alignItems: "center",
    },
    imageHero: {
      width: imgWidth > 35 ? imgWidth : 35,
      aspectRatio: 1.7,
      resizeMode: "contain",
      borderRadius: 3,
    },
    flatListContainer: {
      flex: 1,
      maxWidth: 650,
      alignSelf: "center",
    },
    textTitleHeader: {
      color: colors.dark,
      textAlign: "center",
      fontSize: fontSize > 13 ? 15 : fontSize,
    },
    listTitle: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
    },
    textList: {
      color: colors.semidark,
      textAlign: "center",
      alignSelf: "center",
      fontSize: fontSize > 13 ? 15 : fontSize,
    },
  });

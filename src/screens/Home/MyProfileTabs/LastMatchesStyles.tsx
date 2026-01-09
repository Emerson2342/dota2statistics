import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor } from "@src/services/props";

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    listContainer: {
      //flex: 1,
      paddingHorizontal: 3,
      flexDirection: "row",
      alignItems: "center",
    },
    imageHero: {
      width: 47,
      aspectRatio: 1.7,
      resizeMode: "contain",
      borderRadius: 3,
    },
    flatListContainer: {
      flex: 1,
      alignSelf: "center",
    },
    textTitleHeader: {
      color: colors.dark,
      textAlign: "center",
      fontSize: 12,
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
      fontSize: 12,
    },
  });

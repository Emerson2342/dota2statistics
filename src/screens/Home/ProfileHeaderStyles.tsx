import { StyleSheet } from "react-native";
import { FontModel, ThemeColor } from "../../services/props";

export const createStyles = (colors: ThemeColor, Font: FontModel) =>
  StyleSheet.create({
    profile: {
      alignItems: "center",
      backgroundColor: colors.semidark,
      marginTop: "3%",
      borderRadius: 5,
      width: "97%",
      alignSelf: "center",
      padding: "3%",
      paddingTop: 0,
      paddingBottom: 0,
    },
    infoContainer: {
      width: "100%",
      alignItems: "center",
      flexDirection: "row",
      flex: 1,
    },
    imgContainer: {
      width: "45%",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    imgAvatar: {
      width: "90%",
      aspectRatio: 1,
      resizeMode: "contain",
      borderRadius: 7,
    },
    textProfile: {
      color: "#aaa",
      textAlign: "center",
      fontSize: 13,
      fontFamily: Font.font1,
    },
    imgHero: {
      width: 35,
      height: 35,
      borderRadius: 35,
      borderWidth: 1,
      borderColor: colors.standard,
    },
    flatListHeroes: {
      color: colors.semidark,
      fontSize: 15,
      fontFamily: Font.font1,
    },
    textRank: {
      color: "#fff",
      position: "absolute",
      top: 53,
      left: 103,
      fontSize: 10,
      fontWeight: "bold",
      width: "23%",
      textAlign: "center",
    },
  });

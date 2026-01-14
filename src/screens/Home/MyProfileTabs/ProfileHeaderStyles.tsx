import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor } from "@src/services/props";

const imgWidth = Dimensions.get("screen").width * 0.027;
const imgAvatarWidth = Dimensions.get("screen").width * 0.2;
const fontSize = Dimensions.get("screen").width * 0.03;

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    profile: {
      alignItems: "center",
      backgroundColor: colors.semidark,
      borderRadius: 5,
      width: "97%",
      maxWidth: 650,
      alignSelf: "center",
      padding: "3%",
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
      width: imgAvatarWidth > 95 ? 95 : imgAvatarWidth,
      aspectRatio: 1,
      resizeMode: "contain",
      borderRadius: 7,
    },
    textProfile: {
      color: "#aaa",
      textAlign: "center",
      fontSize: fontSize > 13 ? 15 : fontSize,
    },
    imgHero: {
      width: imgWidth > 35 ? imgWidth : 35,
      aspectRatio: 1,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: colors.standard,
    },
    textRank: {
      color: "#fff",
      position: "absolute",
      fontSize: fontSize > 13 ? 13 : fontSize,
      bottom: 5,
      textAlign: "center",
    },
  });

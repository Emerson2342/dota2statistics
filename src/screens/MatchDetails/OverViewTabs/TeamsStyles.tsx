import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor } from "@src/services/props";

const width = Dimensions.get("window").width;

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    containerItem: {
      width: "95%",
      alignSelf: "center",
      marginBottom: "3%",
      borderRadius: 9,
      elevation: 7,
      backgroundColor: "transparent",
    },
    helpButton: {
      alignItems: "center",
      width: "17%",
    },
    headerContainer: {
      backgroundColor: colors.semidark,
      width: "100%",
      borderColor: "#ccc",
      borderBottomWidth: 1,
      borderTopStartRadius: 7,
      borderTopEndRadius: 7,
    },
    title: {
      fontSize: width * 0.045,
      color: "#fff",
      textAlign: "center",
    },
    textHeader: {
      fontSize: width * 0.025,
      color: "#ddd",
    },
    detailsContainer: {
      width: "100%",
      alignItems: "center",
      padding: "1%",
      borderRadius: 5,
      flexDirection: "row",
    },
    cabecalho: {
      flexDirection: "row",
      justifyContent: "center",
      width: "83%",
      alignSelf: "center",
    },
    k: {
      width: "18%",
      textAlign: "center",
      alignSelf: "flex-end",
      // backgroundColor: "#fafa"
    },
    lhs: {
      width: "7%",
      textAlign: "center",
      alignSelf: "flex-end",
      //backgroundColor: "#cece",
    },
    denies: {
      width: "7%",
      textAlign: "center",
      alignSelf: "flex-end",
      // backgroundColor: "#fafa"
    },
    hDamage: {
      width: "16%",
      textAlign: "center",
      alignSelf: "flex-end",
      // backgroundColor: "#cece"
    },
    tDamage: {
      width: "15%",
      textAlign: "center",
      alignSelf: "flex-end",
      //backgroundColor: "#fafa"
    },
    healing: {
      width: "14%",
      textAlign: "center",
      alignSelf: "flex-end",
      // backgroundColor: "#cece"
    },
    xp: {
      width: "12%",
      textAlign: "center",
      alignSelf: "flex-end",
      // backgroundColor: "#fafa"
    },
    netWorth: {
      width: "12%",
      textAlign: "center",
      alignSelf: "flex-end",
      // backgroundColor: "#cece"
    },
    lvlText: {
      color: colors.semidark,
      fontSize: 10,
      width: "9%",
      textAlign: "center",
    },
    nameText: {
      color: "#006600",
      fontSize: 10,
      marginLeft: "1%",
    },
    containerImage: {
      flexDirection: "row",
      width: "15%",
      alignItems: "center",
      justifyContent: "space-around",
    },
    imageMedal: {
      width: "50%",
      aspectRatio: 1,
      resizeMode: "contain",
      alignSelf: "center",
    },
    imageHero: {
      width: "50%",
      aspectRatio: 1,
      borderRadius: 3,
    },
    infoContainer: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "center",
    },
    infoContainerPercent: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-around",
      display: "none",
    },
    textData: {
      fontSize: width * 0.025,
      color: "#555",
    },
    textDataPercent: {
      fontSize: width * 0.023,
    },
    benchKills: {
      textAlign: "center",
      width: "15%",
      //backgroundColor: "#000",
    },
    benchLhs: {
      textAlign: "center",
      width: "17%",
      //backgroundColor: "#333",
    },
    benchHerDa: {
      textAlign: "center",
      width: "15%",
      //backgroundColor: "#000",
    },
    benchTowDa: {
      textAlign: "right",
      width: "13%",
      //backgroundColor: "#333",
    },
    benchHeal: {
      textAlign: "right",
      width: "13%",
      //backgroundColor: "#000",
    },
    benchXp: {
      textAlign: "right",
      width: "13%",
      //backgroundColor: "#333",
    },
    benchGold: {
      textAlign: "center",
      width: "13%",
      // backgroundColor: "#000",
    },
  });

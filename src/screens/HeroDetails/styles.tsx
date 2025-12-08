import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor, FontModel } from "./../../services/props";

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: colors.light,
    },

    activeIndicator: {
      flex: 0.8,
      justifyContent: "center",
      width: "100%",
      color: colors.semidark,
      alignItems: "center",
    },
    textRegen: {
      color: "#202020",
      fontSize: 11,
    },
    averageContainer: {
      backgroundColor: "#fff",
      margin: "3%",
      borderRadius: 5,
      paddingBottom: "5%",
      padding: "3%",
      elevation: 7,
    },
    titleText: {
      color: "#fff",
      alignSelf: "center",
      textAlign: "center",
      fontSize: Dimensions.get("screen").width * 0.03,
      borderRadius: 5,
      marginBottom: "1%",
      width: "50%",
      padding: "1%",
      backgroundColor: colors.semidark,
    },

    textTitle2: {
      textAlign: "center",
      paddingBottom: "1%",
      fontSize: 17,
    },

    textDescription: {
      width: "100%",
      textAlign: "justify",
      color: "#555",
    },

    abilitiesContainer: {
      justifyContent: "center",
      width: "100%",
    },
    ablitityContainer: {
      paddingHorizontal: "1%",
      width: "99%",
      borderRadius: 5,
      marginBottom: "3.7%",
    },
    titleAbility: {
      textAlign: "center",
      color: colors.semidark,
      paddingBottom: "3%",
    },
    abilityContent: {
      flexDirection: "row",
      width: "100%",
    },
    content1: {
      flexDirection: "row",
      width: "55%",
    },
    content2: {
      width: "45%",
    },
    facetsContainer: {
      //flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      marginTop: "3%",
    },
    abilityImg: {
      width: 35,
      height: 35,
      backgroundColor: "#ccc",
      borderRadius: 7,
    },
    averageContent1: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    averageContent2: {
      paddingLeft: "1%",
      alignItems: "center",
    },
    itemsContainer: {
      flex: 1,
      padding: "3%",
      backgroundColor: "#fff",
      margin: "3%",
      borderRadius: 7,
      alignItems: "center",
      elevation: 7,
      width: "95%",
    },
    textItem: {
      color: colors.semidark,
      backgroundColor: colors.light,
      padding: 3,
      paddingHorizontal: 15,
      margin: 5,
      borderRadius: 5,
    },
  });

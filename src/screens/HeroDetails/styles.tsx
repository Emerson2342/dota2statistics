import { Dimensions, StyleSheet } from "react-native";
import { ThemeColor, FontModel } from "../../services/props";

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
    headerContainer: {
      backgroundColor: colors.semidark,
      width: "95%",
      alignSelf: "center",
      marginTop: "3%",
      borderRadius: 5,
      paddingBottom: "3%",
    },
    imgContainer: {
      width: "25%",
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: "3%",
    },
    image: {
      // borderRadius: 50,
      width: "100%",
      aspectRatio: 1.5,
      borderTopLeftRadius: 7,
      borderTopRightRadius: 7,
    },
    textHelth: {
      fontFamily: "QuickSand-Semibold",
      color: "#fff",
    },
    shadowText: {
      fontFamily: "QuickSand-Semibold",
      position: "absolute",
      color: "black",
      left: 1,
      top: 1,
    },
    textRegen: {
      color: "#202020",
      fontFamily: "QuickSand-Regular",
      fontSize: 11,
    },
    textName: {
      textAlign: "center",
      fontSize: Dimensions.get("screen").width * 0.03,
      color: "#fff",
      fontFamily: "QuickSand-Semibold",
    },
    textAtributo: {
      textAlign: "center",
      fontSize: 15,
      color: "#fff",
      fontFamily: "QuickSand-Semibold",
    },
    nameText: {
      textAlign: "center",
      fontSize: Dimensions.get("screen").width * 0.05,
      color: "#fff",
      alignSelf: "center",
      fontFamily: "QuickSand-Bold",
    },
    atributos: {
      width: "75%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
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
      fontFamily: "QuickSand-Bold",
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
      fontFamily: "QuickSand-Bold",
    },

    textDescription: {
      fontFamily: "QuickSand-Semibold",
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
      fontFamily: "QuickSand-Semibold",
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
    textInfo: {
      fontFamily: "QuickSand-Semibold",
      color: colors.semidark,
    },
    textData: {
      color: "orange",
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
    attContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: "3%",
      width: "70%",
    },

    attNumber: {
      fontSize: 15,
      marginLeft: "3%",
      fontFamily: "QuickSand-Bold",
      color: "#fff",
    },
    attGain: {
      fontSize: 13,
      color: "#aaa",
      fontFamily: "QuickSand-Semibold",
    },
    itemImg: {
      //width: "9%",
      margin: 1,
      //borderRadius: 9,
      //height: undefined,
      //aspectRatio: 1,
    },
    textItem: {
      fontFamily: "QuickSand-Semibold",
      color: colors.semidark,
    },
    textItems: {
      textAlign: "center",
      padding: "1%",
      fontSize: 15,
      fontFamily: "QuickSand-Semibold",
      color: colors.semilight,
    },
    itemContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      paddingBottom: "3%",
      width: "100%",
    },
    button: {
      margin: "2%",
      flexDirection: "row",
      justifyContent: "center",
      padding: "1.5%",
      width: "45%",
      alignItems: "center",
      backgroundColor: colors.semidark,
      borderRadius: 5,
    },
    textButton: {
      fontSize: 15,
      textAlign: "center",
      fontFamily: "QuickSand-Bold",
      color: "#fff",
    },
  });

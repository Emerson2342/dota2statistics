import { StyleSheet } from "react-native";
import { ThemeColor } from "../../services/props";

export const createStyles = (colors: ThemeColor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        inputContainer: {
            flex: 0.07,
            width: "75%",
            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: "row",
        },
        textInput: {
            borderRadius: 5,
            width: "65%",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: "#fff",
            fontFamily: "QuickSand-Semibold",
            borderWidth: 1,
            borderColor: colors.semidark,
        },
        buttonSearch: {
            backgroundColor: colors.semidark,
            padding: "1%",
            width: "30%",
            alignItems: "center",
            borderRadius: 5,
        },
        textButton: {
            fontFamily: "QuickSand-Semibold",
            color: "#fff",
        },
        bodyContainer: {
            flex: 1,
            width: "100%",
        },
        textMessage: {
            textAlign: "center",
            padding: "5%",
            fontFamily: "QuickSand-Semibold",
            color: colors.semidark,
        },
    });

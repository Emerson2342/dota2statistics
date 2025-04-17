import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Linking,
} from "react-native";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { ThemeColor } from "../../services/props";

export function ModalHasUpdate({ handleClose }: { handleClose(): void }) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);

  const title = englishLanguage
    ? "Update Available!"
    : "Atualização Disponível!";

  const text = englishLanguage
    ? "Please update the app to the latest version."
    : "Por favor, atualize o aplicativo para a versão mais recente.";

  const openDotaUrl =
    "https://play.google.com/store/apps/details?id=com.missinhoo.Dota2";

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.textMessage}>{text}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: ColorTheme.light }]}
            onPress={() => handleClose()}
          >
            <Text style={[styles.textButton, { color: ColorTheme.dark }]}>
              {englishLanguage ? "Close" : "Fechar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(openDotaUrl)}
          >
            <Text style={styles.textButton}>
              {englishLanguage ? "Update" : "Atualizar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.7)",
    },
    content: {
      backgroundColor: "#fff",
      padding: "3%",
      borderRadius: 5,
      width: "83%",
      justifyContent: "center",
      alignItems: "center",
    },
    titleText: {
      fontSize: Dimensions.get("screen").width * 0.05,
      fontFamily: "QuickSand-Bold",
      textAlign: "center",
      paddingTop: "2%",
      paddingBottom: "5%",
    },
    textMessage: {
      fontSize: Dimensions.get("screen").width * 0.037,
      color: "#8e8e8e",
      fontFamily: "QuickSand-Semibold",
      textAlign: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: "10%",
      width: "95%",
    },
    button: {
      backgroundColor: colors.semidark,
      alignSelf: "center",
      padding: "3%",
      borderRadius: 7,
      width: "45%",
      borderWidth: 1,
      borderColor: colors.dark,
    },
    textButton: {
      paddingHorizontal: "9%",
      color: "#fff",
      fontFamily: "QuickSand-Bold",
      textAlign: "center",
    },
  });

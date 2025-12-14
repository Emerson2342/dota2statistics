import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { ThemeColor } from "@src/services/props";
import { TextComponent } from "../TextComponent";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";

export function ModalHasUpdate({ handleClose }: { handleClose(): void }) {
  const { englishLanguage } = useSettingsStore();
  const colorTheme = useThemeStore((state) => state.colorTheme);

  const styles = createStyles(colorTheme);

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
        <TextComponent weight="semibold" style={styles.titleText}>
          {title}
        </TextComponent>
        <TextComponent weight="semibold" style={styles.textMessage}>
          {text}
        </TextComponent>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colorTheme.light }]}
            onPress={() => handleClose()}
          >
            <TextComponent
              weight="bold"
              style={[styles.textButton, { color: colorTheme.dark }]}
            >
              {englishLanguage ? "Close" : "Fechar"}
            </TextComponent>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(openDotaUrl)}
          >
            <TextComponent weight="bold" style={styles.textButton}>
              {englishLanguage ? "Update" : "Atualizar"}
            </TextComponent>
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
      textAlign: "center",
      paddingTop: "2%",
      paddingBottom: "5%",
    },
    textMessage: {
      fontSize: Dimensions.get("screen").width * 0.037,
      color: "#8e8e8e",
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
      textAlign: "center",
    },
  });

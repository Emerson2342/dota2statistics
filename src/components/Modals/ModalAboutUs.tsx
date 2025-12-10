import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../../src/context/useThemeContext";
import { BannerAds } from "../Admob/BannerAds";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextComponent } from "../TextComponent";
import { useSettingsStore } from "@src/store/settings";

export function ModalAboutUs({ handleClose }: { handleClose: () => void }) {
  const { englishLanguage } = useSettingsStore();
  const { ColorTheme } = useTheme();

  const text = englishLanguage
    ? "Dota Statistics is a stats app for Dota 2 players. " +
      "The data is obtained from the public OpenDota API, and we only store your email and Steam ID to personalize your experience. " +
      "This app is not affiliated with or endorsed by Valve Corporation. " +
      "All trademarks and intellectual property of Dota 2 belong to Valve Corporation."
    : "O Dota Statistics é um app de estatísticas para jogadores de Dota 2. " +
      "Os dados são obtidos a partir da API pública OpenDota e armazenamos apenas seu e-mail e Steam ID para personalizar sua experiência." +
      " Este app não é afiliado nem endossado pela Valve Corporation. " +
      "Todas as marcas registradas e propriedades intelectuais de Dota 2 pertencem à Valve Corporation.";

  return (
    <SafeAreaView style={styles.container}>
      <BannerAds />
      <View style={styles.content}>
        <View style={styles.modal}>
          <TextComponent weight="semibold" style={styles.text}>
            {"     "}
            {text}
          </TextComponent>
          <TouchableOpacity
            style={[styles.buttonSave, { backgroundColor: ColorTheme.dark }]}
            onPress={() => handleClose()}
          >
            <TextComponent weight="semibold" style={styles.textButton}>
              {englishLanguage ? "Close" : "Fechar"}
            </TextComponent>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    width: "75%",
  },
  modal: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 17,
    borderRadius: 9,
  },
  text: {
    textAlign: "justify",
  },
  textButton: {
    fontSize: 15,
    color: "white",
  },
  buttonSave: {
    elevation: 7,
    padding: "2%",
    marginTop: "13%",
    width: "50%",
    alignItems: "center",
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    borderBottomStartRadius: 15,
    borderBottomEndRadius: 15,
  },
});

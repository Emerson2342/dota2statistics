import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";

export function ModalAboutUs({ handleClose }: { handleClose: () => void }) {
  const { englishLanguage } = useSettingsContext();
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
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>
          {"     "}
          {text}
        </Text>
        <TouchableOpacity
          style={[styles.buttonSave, { backgroundColor: ColorTheme.dark }]}
          onPress={() => handleClose()}
        >
          <Text style={styles.textButton}>
            {englishLanguage ? "Close" : "Fechar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  content: {
    width: "75%",
    padding: 17,
    backgroundColor: "#fff",
    borderRadius: 9,
    alignItems: "center",
  },
  text: {
    fontFamily: "QuickSand-Semibold",
    textAlign: "justify",
  },
  textButton: {
    fontSize: 15,
    fontFamily: "QuickSand-Semibold",
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

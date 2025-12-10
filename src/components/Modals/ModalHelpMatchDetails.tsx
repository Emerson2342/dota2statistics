import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useTheme } from "../../../src/context/useThemeContext";
import { ThemeColor } from "../../../src/services/props";
import { BannerAds } from "../Admob/BannerAds";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextComponent } from "../TextComponent";
import { useSettingsStore } from "@src/store/settings";

export function ModalHelpMatchDetails({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const { englishLanguage } = useSettingsStore();
  const { ColorTheme } = useTheme();

  const styles = createStyles(ColorTheme);

  const text = englishLanguage
    ? "The percentage indicates your performance with the hero compared to other players who used the same hero in the same bracket. For example, if the Last Hits (LH) percentage is at 13%, it means your performance was better than 13% of the players in your bracket who played with this hero."
    : "A porcentagem indica o seu desempenho com o herói em comparação com outros jogadores que utilizaram o mesmo herói na sua bracket. Por exemplo: se o valor de Last Hits(LH) estiver em 13%, isso significa que o seu desempenho foi melhor do que 13% dos jogadores da sua bracket que jogaram com esse herói.";

  return (
    <SafeAreaView style={styles.container}>
      <BannerAds />
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View style={styles.modalContainer}>
          <TextComponent weight="semibold" style={styles.text}>
            {"   "}
            {text}
          </TextComponent>
          <TouchableOpacity style={styles.button} onPress={() => handleClose()}>
            <TextComponent weight="semibold" style={styles.textButton}>
              {englishLanguage ? "Close" : "Fechar"}
            </TextComponent>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.73)",
    },
    modalContainer: {
      width: "90%",
      backgroundColor: "#fff",
      padding: "5%",
      borderRadius: 5,
    },
    text: {
      textAlign: "justify",
    },
    button: {
      backgroundColor: colors.semidark,
      alignSelf: "center",
      borderTopStartRadius: 15,
      borderTopEndRadius: 15,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
      marginTop: "5%",
    },
    textButton: {
      color: "#fff",
      paddingLeft: "10%",
      paddingRight: "10%",
      padding: "3%",
    },
  });

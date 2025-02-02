import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { ThemeColor } from "../../../src/screens/Home/props";

export function ModalHelpMatchDetails({
  handleClose,
}: {
  handleClose: () => void;
}) {

  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();

  const styles = createStyles(ColorTheme);

  const text = englishLanguage ? "The percentage indicates your performance with the hero compared to other players who used the same hero. For example, if the Last Hits (LH) percentage is at 13%, it means your performance was better than 13% of the players who played with this hero." :
    "A porcentagem indica o seu desempenho com o herói em comparação com outros jogadores que utilizaram o mesmo herói. Por exemplo: se o valor de Last Hits(LH) estiver em 13 %, isso significa que o seu desempenho foi melhor do que o de 13 % dos jogadores que jogaram com esse herói."


  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <Text style={styles.text}>{text}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleClose()}>
          <Text style={styles.textButton}>{englishLanguage ? "Close" : "Fechar"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColor) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.73)",
  },
  modalContainer: {
    width: "75%",
    backgroundColor: "#fff",
    padding: "3%",
    borderRadius: 5,

  },
  text: {
    fontFamily: "QuickSand-Semibold"
  },
  button: {
    backgroundColor: colors.semidark,
    alignSelf: "center",
    borderRadius: 5,
    marginTop: "5%"
  },
  textButton: {
    color: "#fff",
    fontFamily: "QuickSand-Semibold",
    paddingLeft: '10%',
    paddingRight: "10%",
    padding: "3%",
  }
});

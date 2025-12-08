import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { ThemeColor } from "../../services/props";
import { TextComponent } from "../TextComponent";

export function ModalRemoveFavoritePlayer({
  message,
  handleClose,
  removePlayer,
}: {
  message: string;
  handleClose: () => void;
  removePlayer: () => void;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();

  const styles = createStyles(ColorTheme);

  const handleConfirm = () => {
    removePlayer();
    handleClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <TextComponent weight="bold" style={styles.textMessage}>{message}</TextComponent>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonCancel}
            onPress={() => handleClose()}
          >
            <TextComponent weight="semibold" style={[styles.textButton, { color: "#000" }]}>
              {englishLanguage ? "Back" : "Não"}
            </TextComponent>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleConfirm()}
          >
            <TextComponent weight="semibold" style={styles.textButton}>
              {englishLanguage ? "Yes" : "Sim"}
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
      backgroundColor: "rgba(0,0,0,0.79)",
    },
    modalContainer: {
      paddingTop: "5%",
      paddingBottom: "7%",
      backgroundColor: "#fff",
      width: "75%",
      padding: "2%",
      borderRadius: 5,
    },
    textMessage: {
      padding: "3%",
      textAlign: "center",
      fontSize: 15,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: "5%",
    },
    button: {
      backgroundColor: colors.semidark,
      width: "45%",
      borderTopStartRadius: 15,
      borderTopEndRadius: 15,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
    },
    buttonCancel: {
      width: "45%",
      borderWidth: 1,
      borderTopStartRadius: 15,
      borderTopEndRadius: 15,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
    },
    textButton: {
      color: "#fff",
      textAlign: "center",
      padding: "5%",
    },
  });

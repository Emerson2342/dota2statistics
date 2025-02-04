import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { PlayerModel, ThemeColor } from "../../services/props";

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
        <View>
          <Text style={styles.textMessage}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => handleClose()}
            >
              <Text style={[styles.textButton, { color: "#000" }]}>
                {englishLanguage ? "Back" : "Voltar"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleConfirm()}
            >
              <Text style={styles.textButton}>
                {englishLanguage ? "Yes" : "Sim"}
              </Text>
            </TouchableOpacity>
          </View>
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
      fontFamily: "QuickSand-Semibold",
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
      borderRadius: 3,
    },
    buttonCancel: {
      width: "45%",
      borderWidth: 1,
      borderRadius: 3,
    },
    textButton: {
      color: "#fff",
      textAlign: "center",
      padding: "5%",
      fontFamily: "QuickSand-Semibold",
    },
  });

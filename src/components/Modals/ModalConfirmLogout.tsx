import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { usePlayerContext } from "../../../src/context/usePlayerContex";
import { useProfileContext } from "../../../src/context/useProfileContext";
import { useTimestampContext } from "../../../src/context/useTimestampContext";

export function ModalConfirmLogOut({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const { setPlayer, setHeroesPlayedId } = usePlayerContext();
  const { setProfile } = useProfileContext();
  const { setPlayerTimestamp } = useTimestampContext();

  const text = englishLanguage
    ? "Do you really want to log out?"
    : "Deseja realmente sair?";

  const handleSignOut = async () => {
    try {
      setProfile(null);
      setPlayerTimestamp(null);
      setPlayer(null);
      setHeroesPlayedId([]);
      await signOut(auth);
      console.log("Usuário deslogado");
    } catch (error) {
      console.error("Erro ao deslogar o usuário:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>{text}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.buttonSave,
              { borderWidth: 1, borderColor: ColorTheme.dark },
            ]}
            onPress={() => handleClose()}
          >
            <Text style={[styles.textButton, { color: ColorTheme.dark }]}>
              {englishLanguage ? "Close" : "Fechar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonSave, { backgroundColor: ColorTheme.dark }]}
            onPress={() => handleSignOut()}
          >
            <Text style={styles.textButton}>
              {englishLanguage ? "Yes" : "Sim"}
            </Text>
          </TouchableOpacity>
        </View>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  textButton: {
    fontSize: 15,
    fontFamily: "QuickSand-Semibold",
    color: "#fff",
  },
  buttonSave: {
    backgroundColor: "#fff",
    elevation: 7,
    padding: "2%",
    marginTop: "13%",
    width: "45%",
    alignItems: "center",
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    borderBottomStartRadius: 15,
    borderBottomEndRadius: 15,
  },
});

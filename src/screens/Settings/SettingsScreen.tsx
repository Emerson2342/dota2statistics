import React, { useCallback, useState } from "react";
import { View, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { createStyles } from "./SettingsScreenStyles";
import ModalMyAccount from "@src/components/Modals/ModalMyAccount";
import { useFocusEffect } from "expo-router";
import { TextComponent } from "@src/components/TextComponent";
import { usePlayerStore } from "@src/store/player";
import { useSettingsStore } from "@src/store/settings";
import { ThemeProps } from "@src/services/props";
import { useThemeStore } from "@src/store/theme";
import { LinearGradientComponent } from "@src/components/LinearGradient";

export function SettingsScreen() {
  const { englishLanguage, setEnglishLanguage, globalTheme, setGlobalTheme } =
    useSettingsStore();
  const setTheme = useThemeStore((state) => state.setTheme);

  const { playerId } = usePlayerStore();
  const [isEnglish, setIsEnglish] = useState<boolean>(englishLanguage);
  const [selectTheme, setSelectTheme] = useState<string>(globalTheme);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const colorTheme = useThemeStore((state) => state.colorTheme);
  const styles = createStyles(colorTheme);

  const themeKeys: Record<string, string> = {
    ti2025: "The International 2025",
    int: englishLanguage ? "Intelligence" : "Inteligência",
    agi: englishLanguage ? "Agility" : "Agilidade",
    str: englishLanguage ? "Strengh" : "Força",
  };

  useFocusEffect(
    useCallback(() => {
      setIsEnglish(englishLanguage);
      setSelectTheme(globalTheme);
    }, [englishLanguage, globalTheme])
  );

  const handleSaveChanges = () => {
    setIsLoading(true);
    setTimeout(() => {
      setEnglishLanguage(isEnglish);
      setGlobalTheme(selectTheme as ThemeProps);
      setTheme(selectTheme as ThemeProps);
      setIsLoading(false);
    }, 300);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.container, { flex: 0.9 }]}>
        <View style={styles.container}>
          <TextComponent weight="bold" style={styles.title}>
            {englishLanguage ? "My Account" : "Minha Conta"}
          </TextComponent>
          <View style={styles.profile}>
            <TextComponent weight="bold">Id Steam:</TextComponent>
            <TextComponent style={styles.textData}>
              {playerId ?? "0000000000"}
            </TextComponent>
          </View>
          <TouchableOpacity
            style={[styles.buttonSave, { marginTop: 15 }]}
            onPress={() => setModalVisible(true)}
          >
            <TextComponent weight="semibold" style={styles.textButton}>
              {englishLanguage ? "Edit" : "Editar"}
            </TextComponent>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <TextComponent weight="bold" style={styles.title}>
            {englishLanguage ? "Language" : "Idioma"}
          </TextComponent>
          <View style={styles.options}>
            <TouchableOpacity
              style={{ marginTop: "2%", marginBottom: "2%" }}
              onPress={() => setIsEnglish(true)}
            >
              <TextComponent
                weight="bold"
                style={
                  isEnglish
                    ? [styles.textOptions, { color: colorTheme.dark }]
                    : styles.textOptions
                }
              >
                <Feather
                  name={isEnglish ? "check-square" : "square"}
                  size={15}
                />{" "}
                {englishLanguage ? "English (EN-US)" : "Inglês (EN-US)"}
              </TextComponent>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginBottom: "2%" }}
              onPress={() => setIsEnglish(false)}
            >
              <TextComponent
                weight="bold"
                style={
                  !isEnglish
                    ? [styles.textOptions, { color: colorTheme.dark }]
                    : styles.textOptions
                }
              >
                <Feather
                  name={isEnglish ? "square" : "check-square"}
                  size={15}
                />{" "}
                {englishLanguage ? "Portuguese (PT-BR)" : "Português (PT-BR) "}
              </TextComponent>
              <TextComponent
                weight="semibold"
                style={[
                  styles.textAlert,
                  { display: isEnglish ? "none" : "flex" },
                ]}
              >
                Mesmo configurado em Português, alguns dados serão apresentados
                em Inglês
              </TextComponent>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <TextComponent weight="bold" style={styles.title}>
            {englishLanguage ? "Theme" : "Tema"}
          </TextComponent>
          <View style={styles.options}>
            {Object.entries(themeKeys).map(
              ([themeKey, themeLabel]: [string, string], index: number) => (
                <TouchableOpacity
                  key={index}
                  style={{ marginTop: "2%" }}
                  onPress={() => setSelectTheme(themeKey)}
                >
                  <TextComponent
                    weight="bold"
                    style={
                      selectTheme === themeKey
                        ? [styles.textOptions, { color: colorTheme.dark }]
                        : styles.textOptions
                    }
                  >
                    <Feather
                      name={
                        selectTheme === themeKey ? "check-square" : "square"
                      }
                      size={15}
                    />{" "}
                    {themeLabel}
                  </TextComponent>
                </TouchableOpacity>
              )
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-evenly",
            }}
          ></View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.buttonSave, { backgroundColor: colorTheme.standard }]}
          onPress={() => handleSaveChanges()}
        >
          <LinearGradientComponent />
          <TextComponent
            weight="semibold"
            style={[styles.textButton, { color: "#fff" }]}
          >
            {englishLanguage ? "Save Changes" : "Salvar"}
          </TextComponent>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ModalMyAccount handleClose={() => setModalVisible(false)} />
      </Modal>
      <Modal visible={isLoading} transparent={true}>
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={35} color={colorTheme.light} />
          <TextComponent
            weight="bold"
            style={{
              color: colorTheme.light,
              margin: 15,
            }}
          >
            {englishLanguage ? "Saving..." : "Salvando..."}
          </TextComponent>
        </View>
      </Modal>
    </View>
  );
}

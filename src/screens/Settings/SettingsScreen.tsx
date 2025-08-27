import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useSettingsContext } from "../../context/useSettingsContext";
import { Feather } from "@expo/vector-icons";
import { createStyles } from "./SettingsScreenStyles";
import { useTheme } from "../../context/useThemeContext";
import { useProfileContext } from "../../context/useProfileContext";
import ModalMyAccount from "../../components/Modals/ModalMyAccount";
import { BannerAds } from "../../components/Admob/BannerAds";
import { useFocusEffect } from "expo-router";

export function SettingsScreen() {
  const { englishLanguage, setEnglishLanguage, globalTheme, setGlobalTheme } =
    useSettingsContext();

  const { profile } = useProfileContext();
  const [isEnglish, setIsEnglish] = useState<boolean>(englishLanguage);
  const [selectTheme, setSelectTheme] = useState<string>(globalTheme);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);

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
      setGlobalTheme(selectTheme);
      setIsLoading(false);
    }, 300);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.container, { flex: 0.9 }]}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {englishLanguage ? "My Account" : "Minha Conta"}
          </Text>
          <Text style={styles.profile}>
            Id Steam: <Text style={styles.textData}>{profile?.id_Steam}</Text>
          </Text>
          <TouchableOpacity
            style={[styles.buttonSave, { marginTop: 15 }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.textButton}>
              {englishLanguage ? "Edit" : "Editar"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>
            {englishLanguage ? "Language" : "Idioma"}
          </Text>
          <View style={styles.options}>
            <TouchableOpacity
              style={{ marginTop: "2%", marginBottom: "2%" }}
              onPress={() => setIsEnglish(true)}
            >
              <Text
                style={
                  isEnglish
                    ? [styles.textOptions, { color: ColorTheme.dark }]
                    : styles.textOptions
                }
              >
                <Feather
                  name={isEnglish ? "check-square" : "square"}
                  size={15}
                />{" "}
                {englishLanguage ? "English (EN-US)" : "Inglês (EN-US)"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginBottom: "2%" }}
              onPress={() => setIsEnglish(false)}
            >
              <Text
                style={
                  !isEnglish
                    ? [styles.textOptions, { color: ColorTheme.dark }]
                    : styles.textOptions
                }
              >
                <Feather
                  name={isEnglish ? "square" : "check-square"}
                  size={15}
                />{" "}
                {englishLanguage ? "Portuguese (PT-BR)" : "Português (PT-BR) "}
              </Text>
              <Text
                style={[
                  styles.textAlert,
                  { display: isEnglish ? "none" : "flex" },
                ]}
              >
                Mesmo configurado em Português, alguns dados serão apresentados
                em Inglês
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>{englishLanguage ? "Theme" : "Tema"}</Text>
          <View style={styles.options}>
            {Object.entries(themeKeys).map(
              ([themeKey, themeLabel]: [string, string], index: number) => (
                <TouchableOpacity
                  key={index}
                  style={{ marginTop: "2%" }}
                  onPress={() => setSelectTheme(themeKey)}
                >
                  <Text
                    style={
                      selectTheme === themeKey
                        ? [styles.textOptions, { color: ColorTheme.dark }]
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
                  </Text>
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
          style={[styles.buttonSave, { backgroundColor: ColorTheme.dark }]}
          onPress={() => handleSaveChanges()}
        >
          <Text style={[styles.textButton, { color: "#fff" }]}>
            {englishLanguage ? "Save Changes" : "Salvar"}
          </Text>
        </TouchableOpacity>
      </View>
      <BannerAds />
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
          <ActivityIndicator size={35} color={ColorTheme.light} />
          <Text
            style={{
              color: ColorTheme.light,
              margin: 15,
              fontFamily: "QuickSand-Bold",
            }}
          >
            {englishLanguage ? "Saving..." : "Salvando..."}
          </Text>
        </View>
      </Modal>
    </View>
  );
}

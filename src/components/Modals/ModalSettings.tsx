import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useSettingsContext } from "../../context/useSettingsContext";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { createStyles } from "./ModalSettingStyles";
import { useTheme } from "../../context/useThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { useProfileContext } from "../../context/useProfileContext";
import ModalMyAccount from "./ModalMyAccount";
import { ModalAboutUs } from "./ModalAboutUs";
import { ModalConfirmLogOut } from "./ModalConfirmLogout";

export function ModalSettings({ handleClose }: { handleClose: () => void }) {
  const { englishLanguage, setEnglishLanguage, globalTheme, setGlobalTheme } =
    useSettingsContext();

  const { profile } = useProfileContext();
  const [isEnglish, setIsEnglish] = useState<boolean>(englishLanguage);
  const [selectTheme, setSelectTheme] = useState<string>(globalTheme);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalConfirmLogOutVisible, setModalConfirmLogOutVisible] =
    useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [modalAboutUsVisible, setModalAboutUsVisible] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const { ColorTheme } = useTheme();

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

  const handleAccount = (deleteAccountProps: boolean) => {
    if (deleteAccountProps)
      setDeleteAccount(true);
    else
      setDeleteAccount(false);
    setModalConfirmLogOutVisible(true);
  }

  const styles = createStyles(ColorTheme);

  return (
    <View style={styles.mainContainer}>
      <View
        style={{
          backgroundColor: "#fff",
          width: "90%",
          borderRadius: 7,
          alignItems: "center",
        }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            {englishLanguage ? "My Account" : "Minha Conta"}
          </Text>
          <Text style={styles.profile}>
            Email: <Text style={styles.textData}>{profile?.email}</Text>
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
        <View
          style={{
            justifyContent: "center",
            width: "100%",
            alignItems: "center",
          }}
        >
          <View style={styles.container}>
            <View style={styles.optionsContainer}>
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
                    {englishLanguage
                      ? "Portuguese (PT-BR)"
                      : "Português (PT-BR) "}
                  </Text>
                  <Text
                    style={[
                      styles.textAlert,
                      { display: isEnglish ? "none" : "flex" },
                    ]}
                  >
                    Mesmo configurado em Português, alguns dados serão
                    apresentados em Inglês
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.optionsContainer}>
              <Text style={styles.title}>
                {englishLanguage ? "Theme" : "Tema"}
              </Text>
              <View style={styles.options}>
                <TouchableOpacity
                  style={{ marginTop: "2%", marginBottom: "2%" }}
                  onPress={() => {
                    setSelectTheme("int");
                  }}
                >
                  <Text
                    style={
                      selectTheme === "int"
                        ? [styles.textOptions, { color: ColorTheme.dark }]
                        : styles.textOptions
                    }
                  >
                    <Feather
                      name={selectTheme === "int" ? "check-square" : "square"}
                      size={15}
                    />
                    {englishLanguage ? "Intelligence" : "Inteligência"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginBottom: "2%" }}
                  onPress={() => {
                    setSelectTheme("agi");
                  }}
                >
                  <Text
                    style={
                      selectTheme === "agi"
                        ? [styles.textOptions, { color: ColorTheme.dark }]
                        : styles.textOptions
                    }
                  >
                    <Feather
                      name={selectTheme === "agi" ? "check-square" : "square"}
                      size={15}
                    />
                    {englishLanguage ? "Agility" : "Agilidade"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginBottom: "2%" }}
                  onPress={() => {
                    setSelectTheme("str");
                  }}
                >
                  <Text
                    style={
                      selectTheme === "str"
                        ? [styles.textOptions, { color: ColorTheme.dark }]
                        : styles.textOptions
                    }
                  >
                    <Feather
                      name={selectTheme === "str" ? "check-square" : "square"}
                      size={15}
                    />
                    {englishLanguage ? "Strengh" : "Força"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-evenly",
                  marginVertical: 15
                }}
              >
                <TouchableOpacity
                  onPress={() => handleAccount(false)}
                  style={styles.buttonLogout}
                >
                  <Text
                    style={{
                      color: ColorTheme.semidark,
                      fontFamily: "QuickSand-Bold",
                    }}
                  >
                    {englishLanguage ? "Log Out " : "Sair "}
                  </Text>
                  <FontAwesome name="sign-out" size={17} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAccount(true)}
                  style={styles.buttonLogout}
                >
                  <Text
                    style={{
                      color: "#a73737",
                      fontFamily: "QuickSand-Bold",
                    }}
                  >
                    {englishLanguage ? "Delete Account " : "Apagar Conta "}
                  </Text>
                  <FontAwesome name="trash" size={17} color={"#a73737"} />
                </TouchableOpacity>

              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonSave}
              onPress={() => handleClose()}
            >
              <Text style={styles.textButton}>
                {englishLanguage ? "Close" : "Fechar"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonSave, { backgroundColor: ColorTheme.dark }]}
              onPress={() => handleSaveChanges()}
            >
              <Text style={[styles.textButton, { color: "#fff" }]}>
                {englishLanguage ? "Save Changes" : "Salvar"}
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            onPress={() => setModalAboutUsVisible(true)}
            style={styles.textAboutUs}
          >
            {englishLanguage ? "About Us" : "Sobre Nós"}
          </Text>
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}
        >
          <ModalMyAccount handleClose={() => setModalVisible(false)} />
        </Modal>
        <Modal
          visible={modalAboutUsVisible}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}
        >
          <ModalAboutUs handleClose={() => setModalAboutUsVisible(false)} />
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
        <Modal
          visible={modalConfirmLogOutVisible}
          transparent={true}
          statusBarTranslucent={true}
          animationType="fade"
        >
          <ModalConfirmLogOut
            handleClose={() => setModalConfirmLogOutVisible(false)}
            deleteAccount={deleteAccount}
          />
        </Modal>
      </View>
    </View>
  );
}

import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useSettingsContext } from "../../context/useSettingsContext";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { createStyles } from "./ModalSettingStyles";
import { useTheme } from "../../context/useThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { useProfileContext } from "../../context/useProfileContext";
import ModalMyAccount from "./ModalMyAccount";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { useTimestampContext } from "../../context/useTimestampContext";
import { usePlayerContext } from "../../context/usePlayerContex";

export function ModalSettings({ handleClose }: { handleClose: () => void }) {
  const { englishLanguage, setEnglishLanguage, globalTheme, setGlobalTheme } =
    useSettingsContext();

  const { setPlayer, setRecentMatches, setHeroesPlayedId } = usePlayerContext();
  const { setProfile } = useProfileContext();
  const { setPlayerTimestamp } = useTimestampContext();
  const { profile } = useProfileContext();
  const [isEnglish, setIsEnglish] = useState<boolean>(englishLanguage);
  const [selectTheme, setSelectTheme] = useState<string>(globalTheme);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { ColorTheme } = useTheme();
  useFocusEffect(
    useCallback(() => {
      setIsEnglish(englishLanguage);
      setSelectTheme(globalTheme);
    }, [englishLanguage, globalTheme])
  );

  const styles = createStyles(ColorTheme);

  const handleSignOut = async () => {
    try {
      setProfile(null);
      setPlayerTimestamp(null);
      setPlayer(null);
      setRecentMatches([]);
      setHeroesPlayedId([]);
      await signOut(auth);
      console.log("Usuário deslogado");
    } catch (error) {
      console.error("Erro ao deslogar o usuário:", error);
    }
  };
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
            style={styles.buttonSave}
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
                    {englishLanguage ? "English" : "Inglês"}
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
                    {englishLanguage ? "Portuguese" : "Português"}
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
              <TouchableOpacity
                onPress={() => handleSignOut()}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
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
            </View>
            <TouchableOpacity
              style={styles.buttonSave}
              onPress={() => {
                setEnglishLanguage(isEnglish);
                setGlobalTheme(selectTheme);
              }}
            >
              <Text style={styles.textButton}>
                {englishLanguage ? "Save Changes" : "Salvar"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.buttonSave}
            onPress={() => handleClose()}
          >
            <Text style={styles.textButton}>
              {englishLanguage ? "Close" : "Fechar"}
            </Text>
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
      </View>
    </View>
  );
}

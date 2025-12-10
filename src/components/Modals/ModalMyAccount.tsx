import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
} from "react-native";
import { HandleCloseInterface, ThemeColor } from "@src/services/props";
import { useTheme } from "@src/context/useThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { ModalLoading } from "./ModalLoading";
import { ModalMessage } from "./ModalMessage";
import { toSteam32 } from "@src/utils/steam";
import { TextComponent } from "../TextComponent";
import { usePlayerStore } from "@src/store/player";
import { useSettingsStore } from "@src/store/settings";

export default function ModalMyAccount({
  handleClose,
}: {
  handleClose: HandleCloseInterface;
}) {
  const { playerId, handleFetchPlayerData, setPlayerId } = usePlayerStore();
  const { englishLanguage } = useSettingsStore();
  const [userId, setUserId] = useState(playerId);
  const [modalMessageVisible, setModalMessageVisible] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);

  const titleMessage = englishLanguage ? "Message" : "Mensagem";

  const messageSuccess = englishLanguage
    ? "Steam ID successfully changed"
    : "Id da Steam alterado com sucesso!";

  const handleSave = () => {
    const convertedId = toSteam32(userId ?? "");
    if (convertedId) {
      setUserId(convertedId);
      setTextMessage(messageSuccess);
      setModalMessageVisible(true);
      setPlayerId(convertedId);
      handleFetchPlayerData(convertedId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TextComponent
          style={[
            styles.title,
            { color: "orange", fontSize: 20, fontFamily: "QuickSand-Bold" },
          ]}
        >
          {englishLanguage ? "My Account" : "Minha Conta"}
        </TextComponent>
        <TextComponent weight="semibold" style={styles.header}>
          Id Steam
        </TextComponent>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <View style={styles.inputContent}>
            <TextInput
              value={userId ?? ""}
              keyboardType="numeric"
              style={styles.inputText}
              onChangeText={(textId) => setUserId(textId)}
            />
            <TouchableOpacity onPress={() => setUserId("")}>
              <Ionicons
                name="close"
                size={15}
                color={ColorTheme.semidark + 90}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ justifyContent: "center", marginBottom: "3%" }}
            onPress={() => {
              setUserId(playerId);
            }}
          >
            <Ionicons
              name="reload"
              size={15}
              color={ColorTheme.semidark + 90}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleClose()}
            style={styles.buttonContent}
          >
            <TextComponent
              weight="bold"
              style={{
                color: ColorTheme.semidark,
              }}
            >
              {englishLanguage ? "Back" : "Voltar"}
            </TextComponent>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSave()}
            style={[styles.buttonContent, { backgroundColor: ColorTheme.dark }]}
          >
            <TextComponent weight="bold" style={{ color: "#fff" }}>
              {englishLanguage ? "Save" : "Salvar"}
            </TextComponent>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={modalMessageVisible}
        animationType="fade"
        statusBarTranslucent={true}
        transparent={true}
      >
        <ModalMessage
          handleClose={() => setModalMessageVisible(false)}
          message={textMessage}
          title={titleMessage}
        />
      </Modal>
      <Modal transparent={true} statusBarTranslucent={true} visible={isLoading}>
        <ModalLoading />
      </Modal>
    </View>
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.7)",
      width: "100%",
    },
    content: {
      backgroundColor: "#fff",
      paddingTop: "5%",
      paddingBottom: "5%",
      borderRadius: 9,
      alignItems: "center",
      width: "90%",
    },
    title: {
      paddingBottom: "3%",
      fontSize: 15,
      color: "#00617c",
    },
    header: {
      width: "90%",
      textAlign: "center",
      marginRight: "10%",
      color: colors.dark,
    },
    inputContent: {
      margin: "3%",
      marginTop: 0,
      borderWidth: 1,
      borderColor: colors.semidark + 90,
      borderRadius: 5,
      width: "80%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    inputText: {
      width: "90%",
      textAlign: "center",
      color: "#808080",
    },
    buttonContainer: {
      width: "90%",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: "5%",
    },
    buttonContent: {
      backgroundColor: "#fff",
      width: "48%",
      alignItems: "center",
      padding: "2%",
      borderTopStartRadius: 15,
      borderTopEndRadius: 15,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
      elevation: 7,
      borderWidth: 1,
      borderColor: colors.dark,
    },
  });

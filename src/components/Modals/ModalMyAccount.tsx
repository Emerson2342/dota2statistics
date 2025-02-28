import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
} from "react-native";
import { HandleCloseInterface, ThemeColor, User } from "../../services/props";
import { useTheme } from "../../../src/context/useThemeContext";
import { useProfileContext } from "../../../src/context/useProfileContext";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { Ionicons } from "@expo/vector-icons";
import { useTimestampContext } from "../../../src/context/useTimestampContext";
import { useRefreshContext } from "../../../src/context/useRefreshContext";
import { doc, setDoc } from "firebase/firestore";
import { db2 } from "../../../src/services/firebaseConfig";
import { ModalLoading } from "./ModalLoading";
import { ModalMessage } from "./ModalMessage";

export default function ModalMyAccount({
  handleClose,
}: {
  handleClose: HandleCloseInterface;
}) {
  const { setRefreshProfile } = useRefreshContext();
  const { profile, setProfile } = useProfileContext();
  const { setPlayerTimestamp, accountTimestamp, setAccountTimestamp } =
    useTimestampContext();
  const { englishLanguage } = useSettingsContext();
  const [user, setUser] = useState<User>({
    email: profile?.email ?? "",
    id_Steam: profile?.id_Steam ?? "",
  });
  const [modalMessageVisible, setModalMessageVisible] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const titleMessage = englishLanguage ? "Message" : "Mensagem";

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const { ColorTheme } = useTheme();

  const messageSuccess = englishLanguage
    ? "Steam ID successfully changed"
    : "Id da Steam alterado com sucesso!";

  const messageError = englishLanguage
    ? "Error trying to change Steam ID"
    : "Erro ao tentar alterar o Id da Steam";

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (
        accountTimestamp == null ||
        accountTimestamp + 86400 < currentTimestamp
      ) {
        handleChangeIdSteam();
        setAccountTimestamp(currentTimestamp);
        console.log("Novo TimesStamp: " + accountTimestamp);
      }
      setTextMessage(messageSuccess);
      setModalMessageVisible(true);
      setIsLoading(false);
      console.log("TimeStamp atual: " + accountTimestamp);
      setProfile(user);
      setPlayerTimestamp(currentTimestamp);
      setRefreshProfile(true);
    }, 300);
  };

  const handleChangeIdSteam = async () => {
    try {
      if (profile == null) return;

      await setDoc(doc(db2, "Profile", profile.email ?? ""), {
        email: profile.email,
        id_Steam: user.id_Steam,
      });
    } catch (error) {
      console.log("Erro ao criar banco de dados: " + error);
      setTextMessage(messageError);
    }
  };

  const styles = createStyles(ColorTheme);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: "orange", fontSize: 20, fontFamily: "QuickSand-Bold" },
          ]}
        >
          {englishLanguage ? "My Account" : "Minha Conta"}
        </Text>
        <Text
          style={[
            styles.title,
            { color: ColorTheme.dark, fontFamily: "QuickSand-Semibold" },
          ]}
        >
          <Text>Email: </Text>
          {profile?.email || ""}
        </Text>
        <Text style={styles.header}>Id Steam</Text>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <View style={styles.inputContent}>
            <TextInput
              keyboardType="numeric"
              style={styles.inputText}
              value={user.id_Steam}
              onChangeText={(textId) =>
                setUser((prevUser) => ({ ...prevUser, id_Steam: textId }))
              }
            />
            <TouchableOpacity
              onPress={() =>
                setUser((prevState) => ({ ...prevState, id_Steam: "" }))
              }
            >
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
              setUser((prevState) => ({
                ...prevState,
                id_Steam: profile?.id_Steam ?? "",
              }));
              setPlayerTimestamp(currentTimestamp);
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
            <Text
              style={{
                color: ColorTheme.semidark,
                fontFamily: "QuickSand-Semibold",
              }}
            >
              {englishLanguage ? "Back" : "Voltar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onLongPress={() => alert(accountTimestamp)}
            onPress={() => handleSave()}
            //onPress={() => alert(JSON.stringify(user, null, 2))}
            style={[styles.buttonContent, { backgroundColor: ColorTheme.dark }]}
          >
            <Text style={{ color: "#fff", fontFamily: "QuickSand-Semibold" }}>
              {englishLanguage ? "Save" : "Salvar"}
            </Text>
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
      fontFamily: "QuickSand-Semibold",
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
      fontFamily: "QuickSand-Regular",
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

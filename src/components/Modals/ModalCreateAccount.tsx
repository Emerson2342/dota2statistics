import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import { HandleCloseInterface, ThemeColor, User } from "../../services/props";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db2 } from "../../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ModalMessage } from "./ModalMessage";
import { ModalLoading } from "./ModalLoading";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useProfileContext } from "../../context/useProfileContext";
import { useTheme } from "../../../src/context/useThemeContext";

export function ModalCreateAccount({
  handleClose,
}: {
  handleClose: HandleCloseInterface;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);
  const [password, setPassword] = useState<string>("");
  const [modalMessageVisible, setModalMessageVisible] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [titleMessage, setTitleMessage] = useState<string>("");
  const [textMessage, setTextMessage] = useState<string>("");

  const messageIdEnglish =
    "Please, check your ID Steam number. It must contains only numbers!";
  const messageIdPortuguese =
    "Por favor, verifique o número do ID da Steam. Ele deve conter apenas números!";
  const emailInUse = englishLanguage
    ? "This email is already in use"
    : "Já tem uma conta cadastrada com esse email";

  const shortPassword = englishLanguage
    ? "Password should be at least 6 characters"
    : "Senha deve ter pelo menos 6 caracteres";

  const messageUserErrorEng = "Error trying to create user: ";
  const messageUserErrorPor = "Erro ao tentar criar usuário: ";

  const messageErrorInputEng = "Please, fill all the fields!";
  const messageErrorInputPor = "Por favor, preencha todos os dados!";

  const [newUser, setNewUser] = useState<User>({
    email: "",
    id_Steam: "",
  });
  const { setProfile } = useProfileContext();

  const handleValidateInput = () => {
    const checkFields = Object.values(newUser).some((v) => v === "");
    const isNumeric = /^\d+$/.test(newUser.id_Steam.toString());

    if (checkFields) {
      setTitleMessage(englishLanguage ? "Error" : "Erro");
      setTextMessage(
        englishLanguage ? messageErrorInputEng : messageErrorInputPor
      );
      setModalMessageVisible(true);
      return;
    }
    if (!isNumeric) {
      setTitleMessage(englishLanguage ? "Error" : "Erro");
      setTextMessage(englishLanguage ? messageIdEnglish : messageIdPortuguese);
      setModalMessageVisible(true);
      return;
    }
    if (password.length < 6) {
      setTitleMessage(englishLanguage ? "Warning" : "Atenção");
      setTextMessage(shortPassword);
      setModalMessageVisible(true);
      return;
    }
    handleCreateUser();
    //alert(JSON.stringify(newUser, null, 2))
  };

  const createProfile = async () => {
    try {
      await setDoc(doc(db2, "Profile", newUser.email), {
        email: newUser.email,
        id_Steam: newUser.id_Steam,
      });
    } catch (error) {
      console.log("Erro ao criar banco de dados: " + error);
    }
  };

  const handleCreateUser = async () => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, newUser.email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        createProfile();
        setProfile(newUser);
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = error.message;
        if (errorMessage === "Firebase: Error (auth/email-already-in-use).") {
          errorMessage = emailInUse;
        }
        setPassword("");
        console.log(errorMessage, errorCode);
        setTitleMessage(englishLanguage ? "Error" : "Erro");
        setTextMessage(
          englishLanguage
            ? messageUserErrorEng + errorMessage
            : messageUserErrorPor + errorMessage
        );
        setModalMessageVisible(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.textTitle}>Create Account</Text>

        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text style={styles.textLabel}>email</Text>
          <TextInput
            placeholder="name@email.com"
            placeholderTextColor={"#ccc"}
            style={styles.input}
            value={newUser.email.toLowerCase()}
            onChangeText={(email) =>
              setNewUser((prevState) => ({ ...prevState, email }))
            }
          />
          <Text style={styles.textLabel}>
            {englishLanguage ? "steam id account" : "id da steam"}
          </Text>
          <TextInput
            placeholder="123456789"
            placeholderTextColor={"#ccc"}
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(id_Steam) =>
              setNewUser((prevState) => ({ ...prevState, id_Steam }))
            }
          />
          <Text style={styles.textLabel}>
            {englishLanguage ? "password" : "senha"}
          </Text>
          <TextInput
            placeholder="*******"
            placeholderTextColor={"#ccc"}
            style={styles.input}
            value={password}
            keyboardType="numeric"
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={styles.buttonContent}>
          <TouchableOpacity style={styles.button} onPress={() => handleClose()}>
            <Text style={styles.textButton}>
              {englishLanguage ? "Cancel" : "Cancelar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleValidateInput()}
            style={[styles.button, styles.buttonCreate]}
          >
            <Text style={[styles.textButton, { color: "#fff" }]}>
              {englishLanguage ? "Create" : "Criar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={loading}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ModalLoading />
      </Modal>
      <Modal
        visible={modalMessageVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ModalMessage
          title={titleMessage}
          message={textMessage}
          handleClose={() => setModalMessageVisible(false)}
        />
      </Modal>
    </KeyboardAvoidingView>
  );
}

export const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#rgba(0,0,0,0.85)",
    },
    content: {
      backgroundColor: "#fff",
      width: "90%",
      padding: "3%",
      paddingBottom: "7%",
      borderRadius: 5,
    },
    textTitle: {
      fontSize: 20,
      color: colors.semidark,
      textAlign: "center",
      fontFamily: "QuickSand-Bold",
      paddingTop: "3%",
      paddingBottom: "5%",
    },
    input: {
      width: "80%",
      backgroundColor: "#f5f5f5",
      padding: 5,
      marginBottom: "5%",
      borderRadius: 5,
      textAlign: "center",
      color: "#555",
      borderBottomWidth: 1,
      borderColor: "#777",
      fontFamily: "QuickSand-Regular",
    },
    textLabel: {
      width: "80%",
      fontFamily: "QuickSand-Semibold",
      color: "#777",
    },
    buttonContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "80%",
      alignSelf: "center",
      paddingTop: "5%",
    },
    button: {
      padding: "3%",
      width: "45%",
      alignItems: "center",
      backgroundColor: "#fff",
      borderTopStartRadius: 15,
      borderTopEndRadius: 15,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
      elevation: 7,
      borderWidth: 1,
    },
    buttonCreate: {
      backgroundColor: colors.semidark,
      borderWidth: 0,
    },
    textButton: {
      fontFamily: "QuickSand-Bold",
      fontSize: 15,
    },
  });

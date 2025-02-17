import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { createStyles } from "./ModalCreateAccount";
import { HandleCloseInterface } from "../../../src/services/props";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { ModalMessage } from "./ModalMessage";
import { ModalLoading } from "./ModalLoading";

export function ModalForgotPassword({
  handleClose,
}: {
  handleClose: HandleCloseInterface;
}) {
  const [email, setEmail] = useState<string>("");
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();

  const [modalMessageVisible, setModalMessageVisible] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [titleMessage, setTitleMessage] = useState<string>("");
  const [textMessage, setTextMessage] = useState<string>("");
  const styles = createStyles(ColorTheme);

  const messageSuccess = englishLanguage
    ? "Password reset email sent!"
    : "E-mail de redefinição de senha enviado!";

  const messageError = englishLanguage
    ? "Please, check your email"
    : "Por favor, cheque seu email";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleResetPassword = async () => {
    if (!emailRegex.test(email)) {
      setTitleMessage(englishLanguage ? "Error" : "Erro");
      setTextMessage(messageError);
      setModalMessageVisible(true);
    } else {
      setLoading(true);
      await sendPasswordResetEmail(auth, email)
        .then(() => {
          setEmail("");

          setTitleMessage(englishLanguage ? "Email send" : "Email enviado");
          setTextMessage(messageSuccess);
          setModalMessageVisible(true);
          console.log("E-mail de redefinição de senha enviado!");
        })
        .catch((error) => {
          console.error("Erro ao enviar e-mail de redefinição: ", error);
        });
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.textTitle}>Forgot your password?</Text>
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
            value={email?.toLowerCase()}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.buttonContent}>
          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.textButton}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonCreate]}
            onPress={() => handleResetPassword()}
          >
            <Text style={[styles.textButton, { color: "#fff" }]}>
              {englishLanguage ? "Send" : "Enviar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={modalMessageVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ModalMessage
          handleClose={() => {
            setModalMessageVisible(false);
          }}
          message={textMessage}
          title={titleMessage}
        />
      </Modal>
      <Modal
        visible={loading}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ModalLoading />
      </Modal>
    </View>
  );
}

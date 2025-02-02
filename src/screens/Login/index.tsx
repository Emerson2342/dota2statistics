import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Animated,
  Dimensions,
  Easing,
  Keyboard,
} from "react-native";

import { ModalForgotPassword } from "../../components/Modals/ModalForgotPassword";

import { createStyles } from "./styles";
import { ModalCreateAccount } from "../../components/Modals/ModalCreateAccount";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db2 } from "../../../src/services/firebaseConfig";
import { ModalMessage } from "../../../src/components/Modals/ModalMessage";
import { ModalLoading } from "../../../src/components/Modals/ModalLoading";
import { doc, getDoc } from "firebase/firestore";
import { User } from "../../services/props";
import { useProfileContext } from "../../../src/context/useProfileContext";
import { useRefreshContext } from "../../../src/context/useRefreshContext";
import { useTheme } from "../../../src/context/useThemeContext";
import Logo from "../../images/logoLogin.png";
import { useSettingsContext } from "../../../src/context/useSettingsContext";

export function Login() {
  const { setProfile } = useProfileContext();

  const { englishLanguage } = useSettingsContext();

  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);

  const [modalForgotPasswordVisible, setModalPasswordVisible] =
    useState<boolean>(false);

  const [modalCreateAccountVisible, setModalCreateAccountVisible] =
    useState<boolean>(false);

  const { refreshProfile, setRefreshProfile } = useRefreshContext();

  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [modalResetPassword, setModalResetPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [databaseVersion, setDatabaseVersion] = useState<string>("");
  const [modalMessageVisible, setModalMessageVisible] =
    useState<boolean>(false);

  const [messateText, setMessageText] = useState<string>("");

  const loginPasswordError = englishLanguage
    ? "Invalid email or password!"
    : "Email e/ou senha inválido(s)!";

  const text = englishLanguage
    ? "Don't have an account? "
    : "Ainda não tem uma conta?";

  const registerText = englishLanguage ? " Register now" : " Registre-se agora";
  const emptyInput = englishLanguage
    ? "Please, fill all the data!"
    : "Favor preencher todos os dados!";
  const getUserData = async () => {
    const docRef = doc(db2, "Profile", login);
    const docSnap = await getDoc(docRef);

    const data = docSnap.data() as User;
    if (docSnap.exists()) {
      setProfile(data);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    if (login == "" || password == "") {
      setModalMessageVisible(true);
      setMessageText(emptyInput);
      setLoading(false);
      return;
    }
    getUserData();

    signInWithEmailAndPassword(auth, login, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Usuário loggado: " + user.email);
        setRefreshProfile(true);
        console.log("Atualizar perfil?" + refreshProfile);
      })
      .catch((error) => {
        const errorCode = error.code;
        setPassword("");
        console.log(errorCode);
        if (errorCode === "auth/invalid-credential") {
          setModalMessageVisible(true);
          setMessageText(loginPasswordError);
        } else {
          setModalMessageVisible(true);
          setMessageText(errorCode);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //animações
  const translateY = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 1300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* <WaveTopLogin /> */}
      <View style={styles.headerContainer}>
        <Image style={{ width: "23%", resizeMode: "contain" }} source={Logo} />
        <Text style={styles.nameText}>Dota 2 Analytics</Text>
      </View>
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Welcome</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.signupText}>{text}</Text>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                setModalCreateAccountVisible(true);
              }}
            >
              <Text
                style={{
                  fontFamily: "QuickSand-Semibold",
                  color: ColorTheme.semidark,
                }}
              >
                {registerText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: "7%", width: "100%" }}>
          <View style={styles.inputContainer}>
            <Text style={styles.textLabel}>email</Text>
            <TextInput
              style={styles.textInput}
              textAlign="center"
              value={login}
              onChangeText={(loginText) =>
                setLogin(loginText.toLowerCase().trim())
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.textLabel}>
              {englishLanguage ? "password" : "senha"}
            </Text>
            <TextInput
              style={styles.textInput}
              textAlign="center"
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
        </View>

        <View style={{ width: "100%", alignItems: "center", marginTop: "7%" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSignIn()}
          >
            <Text style={styles.textButton}>Login</Text>
          </TouchableOpacity>
          <View style={{ alignItems: "center", marginTop: "5%" }}>
            <Text
              style={{
                fontFamily: "QuickSand-Semibold",
                color: ColorTheme.semidark,
              }}
              onPress={() => setModalPasswordVisible(true)}
            >
              Forgot Password?
            </Text>
          </View>
        </View>
      </Animated.View>
      <Modal
        transparent={true}
        visible={modalMessageVisible}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ModalMessage
          handleClose={() => setModalMessageVisible(false)}
          title={
            englishLanguage
              ? "Oops... Something went wrong!"
              : "Oops... Algo deu errado!"
          }
          //error={true}
          message={messateText}
        />
      </Modal>
      <Modal
        transparent={true}
        visible={loading}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ModalLoading />
      </Modal>
      <Modal
        visible={modalCreateAccountVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ModalCreateAccount
          handleClose={() => setModalCreateAccountVisible(false)}
        />
      </Modal>
      <Modal
        visible={modalForgotPasswordVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ModalForgotPassword
          handleClose={() => setModalPasswordVisible(false)}
        />
      </Modal>
    </View>
  );
}

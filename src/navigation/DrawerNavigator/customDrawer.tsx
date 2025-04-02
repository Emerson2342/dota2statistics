import {
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import { usePlayerContext } from "../../../src/context/usePlayerContex";
import { useTheme } from "../../../src/context/useThemeContext";
import { ThemeColor } from "../../../src/services/props";
import { ModalConfirmLogOut } from "../../../src/components/Modals/ModalConfirmLogout";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { FontAwesome } from "@expo/vector-icons";
import { ModalAboutUs } from "../../components/Modals/ModalAboutUs";
import Constants from "expo-constants";
import AvatarImg from "../../images/user.png";

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { player } = usePlayerContext();
  const { ColorTheme } = useTheme();
  const { englishLanguage } = useSettingsContext();

  const [modalConfirmLogOutVisible, setModalConfirmLogOutVisible] =
    useState(false);
  const [modalAboutUsVisible, setModalAboutUsVisible] =
    useState<boolean>(false);

  const avatarSource = player?.profile.avatarfull
    ? { uri: player?.profile.avatarfull }
    : require("../../images/user.png");

  const styles = createStyles(ColorTheme);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={avatarSource} style={styles.image} />
        <Text style={styles.textName}>
          {player?.profile.name != ""
            ? player?.profile.name
            : player?.profile.personaname}
        </Text>
      </View>

      <View style={styles.drawerItems}>
        <DrawerItemList {...props} />
      </View>
      <TouchableOpacity
        onPress={() => setModalConfirmLogOutVisible(true)}
        style={styles.logoutContainer}
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

      <Text style={styles.textAboutUs}>
        {englishLanguage ? "Version " : "Versão "}
        {Constants.expoConfig?.version}
      </Text>
      <Text
        onPress={() => setModalAboutUsVisible(true)}
        style={styles.textAboutUs}
      >
        {englishLanguage ? "About Us" : "Sobre Nós"}
      </Text>

      <Modal
        visible={modalConfirmLogOutVisible}
        transparent={true}
        statusBarTranslucent={true}
        animationType="fade"
      >
        <ModalConfirmLogOut
          handleClose={() => setModalConfirmLogOutVisible(false)}
        />
      </Modal>
      <Modal
        visible={modalAboutUsVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ModalAboutUs handleClose={() => setModalAboutUsVisible(false)} />
      </Modal>
    </View>
  );
};

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      alignItems: "center",
      paddingVertical: 20,
      backgroundColor: colors.semidark,
    },
    textName: {
      fontFamily: "QuickSand-Bold",
      fontSize: Dimensions.get("screen").height * 0.027,
      color: colors.light,
    },
    image: {
      width: Dimensions.get("screen").width * 0.27,
      resizeMode: "contain",
      aspectRatio: 1,
      height: undefined,
      borderRadius: 15,
    },
    drawerItems: {
      flex: 1,
      paddingTop: 10,
    },
    logoutContainer: {
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    textAboutUs: {
      marginVertical: Dimensions.get("screen").width * 0.03,
      textAlign: "center",
      fontFamily: "QuickSand-Semibold",
      color: "#888",
    },
  });

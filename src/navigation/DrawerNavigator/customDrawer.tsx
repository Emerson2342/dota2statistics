import {
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, Modal } from "react-native";
import { usePlayerContext } from "../../context/usePlayerContex";
import { useTheme } from "../../../src/context/useThemeContext";
import { ThemeColor } from "../../../src/services/props";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { ModalAboutUs } from "../../components/Modals/ModalAboutUs";
import Constants from "expo-constants";

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { player } = usePlayerContext();
  const { ColorTheme } = useTheme();
  const { englishLanguage } = useSettingsContext();

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
      paddingTop: 50,
      alignItems: "center",
      paddingVertical: 30,
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

import {
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import { ThemeColor } from "@src/services/props";
import { ModalAboutUs } from "@src/components/Modals/ModalAboutUs";
import Constants from "expo-constants";
import { TextComponent } from "@src/components/TextComponent";
import { usePlayerStore } from "@src/store/player";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";
import { LinearGradientComponent } from "@src/components/LinearGradient";

const imgWidth = Dimensions.get("screen").width * 0.27;

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { player } = usePlayerStore();
  const colorTheme = useThemeStore((state) => state.colorTheme);

  const { englishLanguage } = useSettingsStore();

  const [modalAboutUsVisible, setModalAboutUsVisible] =
    useState<boolean>(false);

  const avatarSource = player?.profile.avatarfull
    ? { uri: player?.profile.avatarfull }
    : require("../../images/user.png");

  const styles = createStyles(colorTheme);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradientComponent />
        <Image source={avatarSource} style={styles.image} />
        <TextComponent weight="bold" style={styles.textName}>
          {player?.profile.name != ""
            ? player?.profile.name
            : player?.profile.personaname}
        </TextComponent>
      </View>

      <View style={styles.drawerItems}>
        <DrawerItemList {...props} />
      </View>
      <TouchableOpacity onPress={() => setModalAboutUsVisible(true)}>
        <TextComponent weight="semibold" style={styles.textAboutUs}>
          {englishLanguage ? "About Us" : "Sobre Nós"}
        </TextComponent>
      </TouchableOpacity>
      <TextComponent weight="semibold" style={styles.textAboutUs}>
        {englishLanguage ? "Version " : "Versão "}
        {Constants.expoConfig?.version}
      </TextComponent>
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
      fontSize: 15,
      color: colors.light,
    },
    image: {
      width: imgWidth > 120 ? 120 : imgWidth,
      height: imgWidth > 120 ? 120 : imgWidth,
      resizeMode: "contain",
      aspectRatio: 1,
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
      marginVertical: 7,
      textAlign: "center",
      color: "#888",
    },
  });

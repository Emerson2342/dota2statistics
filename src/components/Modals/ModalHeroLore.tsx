import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Modal,
} from "react-native";
import { useTheme } from "../../../src/context/useThemeContext";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { ModalRef, ThemeColor } from "../../../src/services/props";
import { BannerAds } from "../Admob/BannerAds";
import { PICTURE_HERO_BASE_URL } from "../../../src/constants/player";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextComponent } from "../TextComponent";

type Props = {
  urlImage: string;
  localizedName: string | undefined;
  loreText: string | undefined;
};

export const ModaHeroLore = forwardRef<ModalRef, Props>(
  ({ urlImage, localizedName, loreText }, ref) => {
    const { ColorTheme } = useTheme();
    const { englishLanguage } = useSettingsContext();
    const styles = CreateStyles(ColorTheme);
    const [visible, setVisible] = useState(false);
    const handleClose = () => setVisible(false);

    useImperativeHandle(ref, () => ({
      open: () => setVisible(true),
      close: () => setVisible(false),
    }));

    return (
      <Modal
        style={styles.container}
        visible={visible}
        transparent={true}
        animationType="fade"
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#000000cc",
          }}
        >
          <BannerAds />
          <View
            style={{
              flex: 0.9,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View style={styles.content}>
              <Image
                style={styles.imgHero}
                src={PICTURE_HERO_BASE_URL + urlImage}
              />
              <TextComponent weight="semibold" style={styles.textName}>
                {localizedName}
              </TextComponent>
              <ScrollView>
                <TextComponent weight="semibold" style={styles.textLore}>
                  {"  "} {loreText}
                </TextComponent>
              </ScrollView>
              <TouchableOpacity
                style={styles.buttonClose}
                onPress={() => handleClose()}
              >
                <TextComponent weight="bold" style={styles.textButton}>
                  {englishLanguage ? "Close" : "Fechar"}
                </TextComponent>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
);

const CreateStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      alignItems: "center",
      justifyContent: "center",
    },
    imgHero: {
      width: "37%",
      aspectRatio: 1.7,
      borderRadius: 9,
      margin: 7,
    },
    content: {
      maxHeight: "93%",
      alignItems: "center",
      width: "85%",
      padding: "5%",
      borderRadius: 7,
      backgroundColor: "#fff",
    },
    textName: {
      fontSize: Dimensions.get("screen").width * 0.053,
      paddingBottom: "7%",
      color: colors.semidark,
    },
    textLore: {
      textAlign: "justify",
    },
    buttonClose: {
      backgroundColor: colors.semidark,
      width: "35%",
      marginTop: "7%",
      borderTopStartRadius: 15,
      borderTopEndRadius: 15,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
    },
    textButton: {
      color: "#fff",
      padding: "5%",
      textAlign: "center",
    },
  });

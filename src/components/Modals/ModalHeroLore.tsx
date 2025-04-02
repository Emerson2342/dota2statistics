import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { useTheme } from "../../../src/context/useThemeContext";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { ThemeColor } from "../../../src/services/props";
import { BannerAds } from "../BannerAds";
import { PICTURE_HERO_BASE_URL } from "../../../src/constants/player";

export function ModaHeroLore({
  urlImage,
  handleClose,
  localizedName,
  loreText,
}: {
  urlImage: string;
  handleClose: () => void;
  localizedName: string | undefined;
  loreText: string | undefined;
}) {
  const { ColorTheme } = useTheme();
  const { englishLanguage } = useSettingsContext();

  const styles = CreateStyles(ColorTheme);

  console.log("Entrou na lore, hero " + localizedName);

  return (
    <View style={styles.container}>
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
          <Text style={styles.textName}>{localizedName}</Text>
          <ScrollView>
            <Text style={styles.textLore}>
              {"  "} {loreText}
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.buttonClose}
            onPress={() => handleClose()}
          >
            <Text style={styles.textButton}>
              {englishLanguage ? "Close" : "Fechar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
      fontFamily: "QuickSand-Bold",
      color: colors.semidark,
    },
    textLore: {
      fontFamily: "QuickSand-Semibold",
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
      fontFamily: "QuickSand-Bold",
      padding: "5%",
      textAlign: "center",
    },
  });

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useTheme } from "../../../src/context/useThemeContext";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { ThemeColor } from "../../../src/services/props";
import { BannerAds } from "../BannerAds";

export function ModaHeroLore({
  handleClose,
  localizedName,
  loreText,
}: {
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
      <View style={{ flex: 0.9, justifyContent: 'center', alignItems: "center", width: '100%' }}>

        <View style={styles.content}>
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
      justifyContent: 'center'
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
      borderRadius: 5,
    },
    textButton: {
      color: "#fff",
      fontFamily: "QuickSand-Bold",
      padding: "5%",
      textAlign: "center",
    },
  });

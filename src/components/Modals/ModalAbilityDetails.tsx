import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
} from "react-native";
import {
  HeroAbilitiesDescriptionsModel,
  ItemDetails,
} from "../../services/props";
import { PICTURE_ITEM_BASE_URL } from "../../constants/player";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { BannerAds } from "../Admob/BannerAds";
export function ModalAbilityDetails({
  ability,
  handleClose,
}: {
  ability: HeroAbilitiesDescriptionsModel | undefined;
  handleClose: () => void;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000AA",
      }}
    >
      <BannerAds />
      <View style={styles.modal}>
        <View style={styles.container}>
          <Text style={styles.textTitle}>{ability?.dname}</Text>
          <Image
            style={styles.imgItem}
            source={{
              uri: PICTURE_ITEM_BASE_URL + ability?.img,
            }}
          />
          <View style={{ flexDirection: 'row' }}>
            <Text>Mana Coust:</Text>

            {Array.isArray(ability?.mc) ? (
              ability.mc.map((mc: string, index: number) => (
                <View key={index}>
                  <Text>{mc}</Text>
                  {ability?.mc && ability.mc.length < index ? null : <Text>,</Text>}
                </View>
              ))
            ) : ability?.mc ? (
              <View>
                <Text>{ability.mc}</Text>
              </View>
            ) : null}

          </View>

          <Text
            style={[
              styles.textDescription,
              { display: ability?.desc ? "flex" : "none" },
            ]}
          >
            {ability?.desc}
          </Text>

          <Text
            style={[
              styles.textLore,
              { display: ability?.lore ? "flex" : "none" },
            ]}
          >
            {ability?.lore}
          </Text>

          <TouchableOpacity
            style={[
              styles.buttonContainer,
              { backgroundColor: ColorTheme.semidark },
            ]}
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

const styles = StyleSheet.create({
  modal: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 10,
    padding: "3%",
  },
  textTitle: {
    fontFamily: "QuickSand-Bold",
    fontSize: Dimensions.get("window").width * 0.05,
    marginBottom: "3%",
  },
  imgItem: {
    width: Dimensions.get("window").width * 0.2,
    height: undefined,
    aspectRatio: 1.5,
    borderRadius: 10,
  },
  textTitleDesc: {
    fontFamily: "QuickSand-Semibold",
    textAlign: "center",
    fontSize: Dimensions.get("window").width * 0.04,
    padding: "2%",
  },
  textDescription: {
    fontFamily: "QuickSand-Semibold",
    textAlign: "center",
    color: "#333",
    fontSize: Dimensions.get("window").width * 0.03,
  },
  textLore: {
    fontFamily: "QuickSand-Bold",
    color: "#aaa",
    textAlign: "center",
    paddingBottom: "3%",
    fontSize: Dimensions.get("window").width * 0.03,
  },
  buttonContainer: {
    marginTop: "5%",
    padding: "2%",
    margin: "2%",
    borderRadius: 10,
    width: "50%",
  },
  textButton: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "QuickSand-Bold",
    fontSize: Dimensions.get("window").width * 0.04,
  },
});

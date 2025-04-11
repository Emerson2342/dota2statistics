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
import { Feather } from "@expo/vector-icons";
export function ModalAbilityDetails({
  ability,
  handleClose,
}: {
  ability: HeroAbilitiesDescriptionsModel | undefined;
  handleClose: () => void;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();

  const manaCoust = (mc?: string | string[]) => {
    if (Array.isArray(mc)) {
      return mc.join(", ");
    }
    return mc ?? "";
  };

  const coolDownTime = (cd?: string | string[]) => {
    if (Array.isArray(cd)) {
      return cd.join(", ");
    }
    return cd ?? "";
  };


  const mana = manaCoust(ability?.mc);
  const coolDown = coolDownTime(ability?.cd);

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
          <View style={{ flexDirection: "row" }}>
            <Image
              style={styles.imgItem}
              source={{
                uri: PICTURE_ITEM_BASE_URL + ability?.img,
              }}
            />
            <View style={{ justifyContent: "center", marginLeft: "3%" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  display: ability?.cd ? "flex" : "none",
                }}
              >
                <Feather name="clock" color={"#555"} />
                <Text style={styles.textDetails}> {coolDown}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  display: ability?.mc ? "flex" : "none",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#2596be",
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                  }}
                />
                <Text style={styles.textDetails}> {mana}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginVertical: "1.3%" }}>
            <Text style={[styles.textDetails, { display: ability?.bkbpierce ? "flex" : "none", }]}>Pierce BKB: <Text style={{ color: "#999" }}>{ability?.bkbpierce}</Text></Text>
            <Text style={[styles.textDetails, { display: ability?.dispellable ? "flex" : "none", }]}>Dispellable: <Text style={{ color: "#999" }}>{ability?.dispellable}</Text></Text>
          </View>
          <Text
            style={[
              styles.textDescription,
              { display: ability?.desc ? "flex" : "none" },
            ]}
          >{"     "}{ability?.desc}
          </Text>

          <Text
            style={[
              styles.textLore,
              { display: ability?.lore ? "flex" : "none" },
            ]}
          >"{ability?.lore}"</Text>

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
  textDetails: {
    fontFamily: "QuickSand-Semibold"
  },
  textTitleDesc: {
    fontFamily: "QuickSand-Semibold",
    textAlign: "center",
    fontSize: Dimensions.get("window").width * 0.04,
    padding: "2%",
  },
  textDescription: {
    fontFamily: "QuickSand-Semibold",
    textAlign: "justify",
    color: "#333",
    fontSize: Dimensions.get("window").width * 0.03,
  },
  textLore: {
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
    paddingBottom: "3%",
    paddingTop: "3%",
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

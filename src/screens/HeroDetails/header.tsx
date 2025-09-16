import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from "react-native";
import { useTheme } from "../../../src/context/useThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import boots from "../../images/boots.png";
import { HeroLore, ModalRef, ThemeColor } from "../../../src/services/props";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import useHeroDetails from "../../../src/hooks/useHeroDetails";

import int from "../../images/int.png";
import agi from "../../images/agi.png";
import str from "../../images/str.png";
import all from "../../images/all.png";
import { PICTURE_HERO_BASE_URL } from "../../../src/constants/player";
import { ModaHeroLore } from "../../../src/components/Modals/ModalHeroLore";
import HeroLoreJson from "./../../constants/Lore.json";
import HeroLorePtBrJson from "./../../constants/LorePtBr.json";

type Props = {
  heroId: number;
};

export function Header({ heroId }: Props) {
  const { ColorTheme } = useTheme();
  const { englishLanguage } = useSettingsContext();
  const heroDetails = useHeroDetails(Number(heroId));
  const styles = createStyles(ColorTheme);

  const modalRef = useRef<ModalRef>(null);

  const heroLore: HeroLore = englishLanguage ? HeroLoreJson : HeroLorePtBrJson;

  let fontImage = PICTURE_HERO_BASE_URL + heroDetails.img;

  let atributo = "";
  let attImage = null;
  let baseAttack = 0;

  switch (heroDetails.primary_attr) {
    case "all":
      {
        atributo = "Universal";
        attImage = all;
        baseAttack =
          (heroDetails.base_str + heroDetails.base_agi + heroDetails.base_int) *
          0.7;
      }
      break;
    case "str":
      {
        atributo = englishLanguage ? "Strength" : "Força";
        attImage = str;
        baseAttack = heroDetails.base_str;
      }
      break;
    case "agi":
      {
        atributo = englishLanguage ? "Agility" : "Agilidade";
        attImage = agi;
        baseAttack = heroDetails.base_agi;
      }
      break;
    case "int":
      {
        atributo = englishLanguage ? "Intelligence" : "Inteligência";
        attImage = int;
        baseAttack = heroDetails.base_int;
      }
      break;
  }
  const baseAttMin = heroDetails.base_attack_min + baseAttack;
  const baseAttMax = heroDetails.base_attack_max + baseAttack;
  const baseHelth = 120 + heroDetails.base_str * 22;
  const baseMana = 75 + heroDetails.base_int * 12;
  const helthRegen =
    (heroDetails?.base_health_regen ?? 0) + heroDetails.base_str * 0.1;
  const manaRegen =
    (heroDetails.base_mana_regen ?? 0) +
    heroDetails.base_int * 0.05 * (1 + heroDetails.base_int * 0.02);

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => modalRef.current?.open()}>
        <Ionicons
          name="information-circle"
          color={"#fff"}
          style={{ position: "absolute", margin: 5, right: 3 }}
          size={27}
        />
      </TouchableOpacity>
      <Text style={styles.nameText}>{heroDetails.localized_name}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <Image style={{ width: 15, height: 15 }} source={attImage} />

        <Text style={[styles.textAtributo, { color: "#bbb", fontSize: 13 }]}>
          {" "}
          {atributo}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.imgContainer}>
          <Image
            style={styles.image}
            source={{
              uri: fontImage,
            }}
            onError={(error) =>
              console.error("Erro ao carregar a imagem: ", error)
            }
          />
          <LinearGradient
            colors={["#2a6623", "#79ee3c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.shadowText}>{Math.round(baseHelth)}</Text>
              <Text style={styles.textHelth}>{baseHelth}</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["#125adc", "#71f3fd"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: "100%",
              alignItems: "center",
              borderBottomRightRadius: 7,
              borderBottomLeftRadius: 7,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.shadowText}>{Math.round(baseMana)}</Text>
              <Text style={styles.textHelth}>{Math.round(baseMana)}</Text>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.att}>
          <View
            style={{
              justifyContent: "space-around",
              width: "30%",
              alignItems: "center",
            }}
          >
            <View style={styles.attContainer}>
              <Image style={{ width: 19, height: 19 }} source={str} />
              <Text style={styles.attNumber}>{heroDetails.base_str}</Text>
              <Text style={styles.attGain}> + {heroDetails.str_gain}</Text>
            </View>
            <View style={styles.attContainer}>
              <Image style={{ width: 19, height: 19 }} source={agi} />
              <Text style={styles.attNumber}>{heroDetails.base_agi}</Text>
              <Text style={styles.attGain}> + {heroDetails.agi_gain}</Text>
            </View>
            <View style={styles.attContainer}>
              <Image style={{ width: 19, height: 19 }} source={int} />
              <Text style={styles.attNumber}>{heroDetails.base_int}</Text>
              <Text style={styles.attGain}> + {heroDetails.int_gain}</Text>
            </View>
          </View>
          <View style={{ width: "65%", alignItems: "center" }}>
            <Text style={styles.textAtributo}>{heroDetails.attack_type}</Text>
            <View
              style={{
                flexWrap: "wrap",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {heroDetails.roles.map((role, index) => (
                <Text key={index} style={styles.textName}>
                  {role}
                  {index !== heroDetails.roles.length - 1 ? ", " : ""}
                </Text>
              ))}
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons name="sword" size={17} color={"#ccc"} />
                <Text
                  style={[styles.attGain, { color: "#fff" }]}
                >{`${Math.floor(baseAttMin)} - ${Math.floor(
                  baseAttMax
                )}`}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image style={{ width: 23, height: 23 }} source={boots} />
                <Text style={[styles.attGain, { color: "#fff" }]}>
                  {" "}
                  {heroDetails.move_speed}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <ModaHeroLore
        ref={modalRef}
        urlImage={heroDetails.img}
        localizedName={heroDetails.localized_name}
        loreText={heroLore[heroDetails.name]}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    headerContainer: {
      backgroundColor: colors.semidark,
      width: "95%",
      alignSelf: "center",
      marginTop: "3%",
      borderRadius: 5,
      paddingBottom: "3%",
    },
    nameText: {
      textAlign: "center",
      fontSize: Dimensions.get("screen").width * 0.05,
      color: "#fff",
      alignSelf: "center",
      fontFamily: "QuickSand-Bold",
    },
    textAtributo: {
      textAlign: "center",
      fontSize: 15,
      color: "#fff",
      fontFamily: "QuickSand-Semibold",
    },
    attContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: "3%",
      width: "70%",
    },
    attNumber: {
      fontSize: 15,
      marginLeft: "3%",
      fontFamily: "QuickSand-Bold",
      color: "#fff",
    },
    attGain: {
      fontSize: 13,
      color: "#aaa",
      fontFamily: "QuickSand-Semibold",
    },
    textName: {
      textAlign: "center",
      fontSize: Dimensions.get("screen").width * 0.03,
      color: "#fff",
      fontFamily: "QuickSand-Semibold",
    },
    textHelth: {
      fontFamily: "QuickSand-Semibold",
      color: "#fff",
    },
    shadowText: {
      fontFamily: "QuickSand-Semibold",
      position: "absolute",
      color: "black",
      left: 1,
      top: 1,
    },
    att: {
      width: "75%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    imgContainer: {
      width: "25%",
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: "3%",
    },
    image: {
      width: "100%",
      aspectRatio: 1.5,
      borderTopLeftRadius: 7,
      borderTopRightRadius: 7,
    },
  });

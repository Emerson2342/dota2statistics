import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";

import { createStyles } from "./ProfileHeaderStyles";
import { Medal } from "../../components/Medals/MedalsList";
import {
  FontModel,
  HeroDetailsModel,
  PlayerModel,
  RecentMatches,
  RootStackParamList,
} from "../../services/props";
import { useSettingsContext } from "../../context/useSettingsContext";

import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import { PICTURE_HERO_BASE_URL } from "../../constants/player";
import { useTheme } from "../../context/useThemeContext";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BannerAds } from "../../../src/components/BannerAds";

const NUMBER_COLUMNS = 10;

export function ProfileHeader({
  player,
  heroesId,
  recentMatches,
}: {
  player: PlayerModel | null;
  heroesId: number[];
  recentMatches: RecentMatches[] | null;
}) {
  const Font: FontModel = {
    font1: "QuickSand-Semibold",
    font2: "QuickSand-Bold",
    font3: "QuickSand-Regular",
  };
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];
  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList, "HeroDetails">>();

  const styles = createStyles(ColorTheme, Font);

  let vitorias = 0;
  let derrotas = 0;

  const calcularResultadoFinal = (item: RecentMatches): boolean => {
    const team = item.player_slot < 5 ? 1 : 2;
    const resultadoFinal =
      (team === 1 && item.radiant_win) || (team === 2 && !item.radiant_win);
    return resultadoFinal;
  };

  recentMatches?.forEach((item: RecentMatches) => {
    const resultadoFinal = calcularResultadoFinal(item);
    if (resultadoFinal) {
      vitorias++;
    } else {
      derrotas++;
    }
  });
  const winrate = ((vitorias / (vitorias + derrotas)) * 100)
    .toFixed(2)
    .toString()
    .replace(".", ",");

  const renderHeroesPlayed = ({
    item,
    index,
  }: {
    item: number;
    index: number;
  }) => {
    const hero = heroArray.find((hero) => hero.id === item);
    let nomeHero = hero?.name || "";

    let imgSource =
      PICTURE_HERO_BASE_URL +
      "/apps/dota2/images/dota_react/heroes/" +
      nomeHero +
      ".png?";
    const GoToHeroDetails = () => {
      const heroDetails = heroArray.find((hero) => hero.id === item);
      if (heroDetails) {
        navigation.navigate("HeroDetails", { heroDetails: heroDetails });
      } else {
        alert("Hero not found");
      }
    };

    return (
      <TouchableOpacity
        style={{ margin: "0.5%" }}
        onPress={() => {
          GoToHeroDetails();
        }}
      >
        <Image
          style={styles.imgHero}
          source={{
            uri: imgSource,
          }}
          key={index.toString()}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <BannerAds />
      <View
        style={[styles.profile, { flex: heroesId.length > 10 ? 0.58 : 0.7 }]}
      >
        <View style={styles.infoContainer}>
          <View style={styles.imgContainer}>
            <View style={{ width: "50%", alignItems: "center" }}>
              <Image
                source={{ uri: player?.profile.avatarfull }}
                style={styles.imgAvatar}
              />
            </View>
            <View style={{ width: "50%", alignItems: "center" }}>
              <Image
                source={{ uri: `${Medal(player?.rank_tier)}` }}
                style={styles.imgAvatar}
              />
            </View>
            <Text style={styles.textRank}>{player?.leaderboard_rank}</Text>
          </View>
          <View
            style={{
              width: "55%",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styles.textProfile,
                { color: ColorTheme.light, fontSize: 17 },
              ]}
            >
              {player?.profile.name === ""
                ? player?.profile.personaname
                : player?.profile.name}
            </Text>
            <Text style={[styles.textProfile, { color: "#fff" }]}>
              {englishLanguage ? "Last 20 Matches" : "Últimas 20 Partidas"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <Text style={styles.textProfile}>
                {englishLanguage ? "Win" : "Vitórias"}:{" "}
                <Text style={[styles.textProfile, { color: "orange" }]}>
                  {vitorias}
                </Text>
              </Text>
              <Text style={styles.textProfile}>
                {englishLanguage ? "Loss" : "Derrotas"}:{" "}
                <Text style={[styles.textProfile, { color: "orange" }]}>
                  {derrotas}
                </Text>
              </Text>
            </View>
            <Text style={styles.textProfile}>
              Winrate:
              <Text style={[styles.textProfile, { color: "orange" }]}>
                {winrate ? ` ${winrate}%` : ""}
              </Text>
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
              }}
            ></View>
          </View>
        </View>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: heroesId.length > 10 ? 0.42 : 0.3,
          paddingVertical: "1.7%",
        }}
      >
        <FlatList
          data={heroesId}
          renderItem={renderHeroesPlayed}
          numColumns={NUMBER_COLUMNS}
          keyExtractor={(item) => item.toString()}
          scrollEnabled={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        />
      </View>
    </View>
  );
}

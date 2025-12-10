import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";

import { createStyles } from "./ProfileHeaderStyles";
import { Medal } from "@src/components/Medals/MedalsList";
import {
  HeroDetailsModel,
  PlayerModel,
  RecentMatches,
} from "../../../services/props";

import HeroesDetails from "@src/components/Heroes/HeroesDetails.json";
import { PICTURE_HERO_BASE_URL } from "@src/constants/player";
import { useTheme } from "@src/context/useThemeContext";
import { useRouter } from "expo-router";
import { TextComponent } from "@src/components/TextComponent";
import { useSettingsStore } from "@src/store/settings";

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
  const router = useRouter();
  const { englishLanguage } = useSettingsStore();
  const { ColorTheme } = useTheme();
  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];

  const styles = createStyles(ColorTheme);

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

  const GoToHeroDetails = (item: number | undefined) => {
    router.push({
      pathname: "/hero-details",
      params: { heroId: item?.toString() ?? "0" },
    });
  };

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

    return (
      <TouchableOpacity
        style={{ margin: "0.5%" }}
        onPress={() => {
          GoToHeroDetails(hero?.id);
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
      <View
        style={[
          styles.profile,
          {
            flex: heroesId.length > 5 ? 0.5 : 0.6,
          },
        ]}
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
          </View>
          <TextComponent
            weight="bold"
            style={[
              styles.textRank,
              {
                display: player && player?.rank_tier < 80 ? "none" : "flex",
              },
            ]}
          >
            {player?.leaderboard_rank}
          </TextComponent>
          <View
            style={{
              width: "55%",
              alignItems: "center",
            }}
          >
            <TextComponent
              weight="semibold"
              style={[
                styles.textProfile,
                {
                  color: ColorTheme.light,
                  fontSize: Dimensions.get("screen").width * 0.047,
                },
              ]}
              numberOfLines={2}
            >
              {player?.profile.name === ""
                ? player?.profile.personaname
                : player?.profile.name}
            </TextComponent>
            <TextComponent
              weight="semibold"
              style={[styles.textProfile, { color: "#fff" }]}
            >
              {englishLanguage ? "Last 20 Matches" : "Últimas 20 Partidas"}
            </TextComponent>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <TextComponent weight="semibold" style={styles.textProfile}>
                {englishLanguage ? "Win" : "Vitórias"}:{" "}
                <TextComponent
                  style={[styles.textProfile, { color: "orange" }]}
                >
                  {vitorias}
                </TextComponent>
              </TextComponent>
              <TextComponent weight="semibold" style={styles.textProfile}>
                {englishLanguage ? "Loss" : "Derrotas"}:{" "}
                <TextComponent
                  weight="semibold"
                  style={[styles.textProfile, { color: "orange" }]}
                >
                  {derrotas}
                </TextComponent>
              </TextComponent>
            </View>
            <TextComponent weight="semibold" style={styles.textProfile}>
              Winrate:
              <TextComponent
                weight="semibold"
                style={[styles.textProfile, { color: "orange" }]}
              >
                {winrate ? ` ${winrate}%` : ""}
              </TextComponent>
            </TextComponent>
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
          flex: heroesId.length > 5 ? 0.5 : 0.4,
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

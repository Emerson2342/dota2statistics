import { MotiView } from "moti";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Dimensions,
} from "react-native";
import { createStyles } from "./LastMatchesStyles";
import {
  HeroDetailsModel,
  RecentMatches,
  RootStackParamList,
} from "../../services/props";
import { useSettingsContext } from "../../context/useSettingsContext";

import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import { PICTURE_HERO_BASE_URL } from "../../constants/player";
import { usePlayerContext } from "../../context/usePlayerContex";
import { useTheme } from "../../context/useThemeContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";

export function LastMatches({
  playerId,
  recentMatches,
  onRefresh,
}: {
  playerId: string | undefined;
  recentMatches: RecentMatches[] | null;
  onRefresh: () => void;
}) {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "MatchDetails">>();

  const { englishLanguage } = useSettingsContext();

  const { player } = usePlayerContext();
  const { ColorTheme } = useTheme();

  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];

  const styles = createStyles(ColorTheme);

  const refresh = useCallback(() => {
    onRefresh();
  }, []);

  const handleGoToMatch = (
    matchIdIndex: number,
    playerIdIndex: string | null
  ) => {
    navigation.navigate("MatchDetails", {
      MatchDetailsIndex: matchIdIndex,
      PlayerIdIndex: playerIdIndex,
      RadiantName: undefined,
      DireName: undefined,
      LeagueNameIndex: null,
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: RecentMatches;
    index: number;
  }) => {
    const startDate = new Date(item.start_time * 1000);
    const durationInMinutes = item.duration;
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedDuration = `${formattedHours}:${formattedMinutes}`;

    const hoursDate = startDate.getHours();
    const minutesDate = startDate.getMinutes();

    const formattedTime = `${hoursDate
      .toString()
      .padStart(2, "0")}:${minutesDate.toString().padStart(2, "0")}`;

    const lobbyType = {
      0: "Casual",
      1: "Practice",
      2: "Tournament",
      3: "Tutorial",
      4: "Bots",
      5: "Team Match",
      6: "Solo Queue",
      7: "Ranked",
      9: "Solo Mid",
    };

    const gameMode = {
      0: "Unknown",
      1: "All Pick",
      2: "Captains Mode",
      3: "Random Draft",
      4: "Single Draft",
      5: "Team All Random",
      6: "Intro",
      7: "Diretide",
      8: "Reverse Captain Mode",
      9: "Greeviling",
      10: "Tutorial",
      11: "Mid Only",
      12: "Least Played",
      13: "Limited Heroes",
      14: "Compendium",
      15: "Custom",
      16: "Captains Draft",
      17: "Balanced Draft",
      18: "Ability draft",
      19: "Event",
      20: "Rd Death Match",
      21: "1v1 Mid",
      22: "All Draft",
      23: "Turbo",
      24: "Mutation",
      25: "Coach Challenge",
    };

    const team = item.player_slot < 5 ? 1 : 2;
    const resultadoFinal =
      (team == 1 && item.radiant_win == true) ||
      (team == 2 && item.radiant_win == false)
        ? true
        : false;

    const hero = heroArray.find((hero) => hero.id === item.hero_id);

    let imgSource = PICTURE_HERO_BASE_URL + hero?.img;
    return (
      <TouchableOpacity
        onPress={() =>
          handleGoToMatch(
            item.match_id,
            playerId
              ? playerId
              : player && player?.profile.account_id.toString()
          )
        }
        key={index}
        style={[
          styles.listContainer,
          {
            backgroundColor: index % 2 === 0 ? ColorTheme.light : "#fff",
          },
        ]}
      >
        <Image
          style={styles.imageHero} // 13%
          source={{
            uri: imgSource,
          }}
        />
        <Text
          style={[
            styles.textList,
            {
              color: resultadoFinal ? "#268626" : "#9a0c28",
              width: "7%",
            },
          ]}
        >
          {resultadoFinal ? (
            <MaterialIcons name="thumb-up" size={17} color="#268626" />
          ) : (
            <MaterialIcons name="thumb-down" size={17} color="#9a0c28" />
          )}
        </Text>
        <Text style={[styles.textList, { width: "28%" }]}>
          {startDate.toLocaleDateString(englishLanguage ? "en-US" : "pt-BR")}-
          {formattedTime}
        </Text>
        <View style={{ width: "23%" }}>
          <Text
            style={[
              styles.textList,
              {
                color: ColorTheme.semilight,
                fontSize: Dimensions.get("screen").width * 0.023,
              },
            ]}
          >
            {lobbyType[item.lobby_type as keyof typeof lobbyType]}
          </Text>
          <Text style={[styles.textList, { color: ColorTheme.dark }]}>
            {gameMode[item.game_mode as keyof typeof gameMode]}
          </Text>
        </View>
        <Text style={[styles.textList, { width: "10%" }]}>
          {formattedDuration}
        </Text>
        <View
          style={{
            flexDirection: "row",
            width: "15%",
            justifyContent: "center",
          }}
        >
          <Text style={[styles.textList, { color: "#268626" }]}>
            {item.kills}/
          </Text>
          <Text style={[styles.textList, { color: "#9a0c28" }]}>
            {item.deaths}/
          </Text>
          <Text style={[styles.textList, { color: "#996300" }]}>
            {item.assists}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MotiView style={styles.flatListContainer}>
      <View style={styles.listTitle}>
        <Text style={[styles.textTitleHeader, { width: "13%" }]}>
          {englishLanguage ? "Hero" : "Herói"}
        </Text>
        <Text style={[styles.textTitleHeader, { width: "40%" }]}>
          {englishLanguage ? "Date/Time" : "Data/Hora"}
        </Text>
        <Text style={[styles.textTitleHeader, { width: "17%" }]}>
          {englishLanguage ? "Mode" : "Modo"}
        </Text>
        <Text style={[styles.textTitleHeader, { width: "15%" }]}>
          {englishLanguage ? "Duration" : "Duração"}
        </Text>
        <Text style={[styles.textTitleHeader, { width: "15%" }]}>K/D/A</Text>
      </View>
      <FlatList
        data={recentMatches}
        renderItem={renderItem}
        keyExtractor={(item: RecentMatches) => item.match_id.toString()}
        initialNumToRender={20}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refresh}
            colors={[
              ColorTheme.light,
              ColorTheme.semilight,
              ColorTheme.standard,
            ]}
            progressBackgroundColor={ColorTheme.dark}
          />
        }
      />
    </MotiView>
  );
}

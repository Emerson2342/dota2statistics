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
  GameModeNames,
  HeroDetailsModel,
  LobbyTypeNames,
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
import { GameMode, LobbyType } from "../../../src/services/enum";

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
    playerIdIndex: string | null,
    lobbyType?: string,
    gameMode?: string
  ) => {
    navigation.navigate("MatchDetails", {
      MatchDetailsIndex: matchIdIndex,
      PlayerIdIndex: playerIdIndex,
      LobbyType: lobbyType,
      GameMode: gameMode,
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

    const lobbyTypeValue = item.lobby_type as LobbyType;
    const gameModeValue = item.game_mode as GameMode;

    const formattedTime = `${hoursDate
      .toString()
      .padStart(2, "0")}:${minutesDate.toString().padStart(2, "0")}`;

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
              : player && player?.profile.account_id.toString(),
            LobbyTypeNames[lobbyTypeValue].toString(),
            GameModeNames[gameModeValue].toString()
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
        <Text style={[styles.textList, { width: "32%" }]}>
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
            {LobbyTypeNames[lobbyTypeValue]}
          </Text>
          <Text style={[styles.textList, { color: ColorTheme.dark }]}>
            {GameModeNames[gameModeValue]}
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
        <Text style={[styles.textTitleHeader, { width: "13%" }]}>K/D/A</Text>
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

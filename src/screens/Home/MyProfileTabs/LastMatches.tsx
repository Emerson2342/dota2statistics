import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  Dimensions,
  DimensionValue,
  Animated,
  ScrollView,
} from "react-native";
import { createStyles } from "./LastMatchesStyles";
import {
  GameModeNames,
  Hero,
  HeroDetailsModel,
  LobbyTypeNames,
  RecentMatches,
} from "@src/services/props";

import HeroesDetails from "@src/components/Heroes/HeroesDetails.json";
import { PICTURE_HERO_BASE_URL } from "@src/constants/player";
import { MaterialIcons } from "@expo/vector-icons";
import { GameMode, LobbyType } from "@src/services/enum";
import { useRouter } from "expo-router";
import {
  formatDuration,
  formatStartTime,
  overviewBar,
} from "@src/utils/matchOverviewUtils";
import { TextComponent } from "@src/components/TextComponent";
import { usePlayerStore } from "@src/store/player";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";
import { hexToRgba } from "@src/utils/convertHexToRgba";

const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];
const fontSize = Dimensions.get("screen").width * 0.02;

function LastMatchesComponent({
  playerId,
  recentMatches,
  onRefresh,
}: {
  playerId: string | undefined;
  recentMatches: RecentMatches[] | null;
  onRefresh: () => Promise<void>;
}) {
  const router = useRouter();
  const { englishLanguage } = useSettingsStore();

  const { player } = usePlayerStore();
  const colorTheme = useThemeStore((state) => state.colorTheme);

  const styles = createStyles(colorTheme);

  const refresh = useCallback(async () => {
    await onRefresh();
  }, [onRefresh]);

  const handleGoToMatch = (
    matchIdIndex: number,
    playerIdIndex: string | null,
    lobbyType?: string,
    gameMode?: string
  ) => {
    router.push({
      pathname: "/match-details",
      params: {
        matchDetailsId: matchIdIndex.toString(),
        playerIdIndex: playerIdIndex,
      },
    });
  };

  const heroMap = useMemo(() => {
    const map: Record<number, HeroDetailsModel> = {};
    heroArray.forEach((h) => {
      map[h.id] = h;
    });
    return map;
  }, [heroArray]);

  const renderItem = useCallback(
    ({ item, index }: { item: RecentMatches; index: number }) => {
      const startDate = new Date(item.start_time * 1000);

      const formattedTime = formatStartTime(item.start_time);
      const formattedDuration = formatDuration(item.duration);

      const { killsWidth } = overviewBar(item.kills, item.deaths, item.assists);

      const lobbyTypeValue = item.lobby_type as LobbyType;
      const gameModeValue = item.game_mode as GameMode;

      const team = item.player_slot < 5 ? 1 : 2;
      const finalResult =
        (team == 1 && item.radiant_win == true) ||
        (team == 2 && item.radiant_win == false)
          ? true
          : false;

      const hero = heroMap[item.hero_id];

      let imgSource = PICTURE_HERO_BASE_URL + hero?.img;
      return (
        <View key={`match-${item.match_id}`}>
          <TouchableOpacity
            style={[
              styles.listContainer,
              {
                backgroundColor:
                  index % 2 === 0
                    ? hexToRgba(colorTheme.light, 0.5)
                    : hexToRgba("#ffffff", 0.8),
                //marginVertical: 2,
                //borderWidth: 1,
                borderColor: colorTheme.light,
              },
            ]}
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
          >
            <View
              style={{
                flex: 2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Image
                style={styles.imageHero}
                source={{
                  uri: imgSource,
                }}
              />
              <TextComponent
                weight="bold"
                style={{ color: finalResult ? "#268626" : "#9a0c28" }}
              >
                {finalResult ? (
                  <MaterialIcons
                    name="thumb-up"
                    size={fontSize > 15 ? fontSize : 15}
                    color="#268626"
                  />
                ) : (
                  <MaterialIcons
                    name="thumb-down"
                    size={fontSize > 15 ? fontSize : 15}
                    color="#9a0c28"
                  />
                )}
              </TextComponent>
            </View>
            <View style={{ flex: 3 }}>
              <TextComponent
                weight="bold"
                style={[styles.textList, { fontFamily: "QuickSand-Semibold" }]}
              >
                {startDate.toLocaleDateString(
                  englishLanguage ? "en-US" : "pt-BR"
                )}
                -{formattedTime}
              </TextComponent>
            </View>
            <View style={{ flex: 2.5 }}>
              <TextComponent
                weight="bold"
                style={[
                  styles.textList,
                  {
                    color: colorTheme.semilight,
                    fontSize: fontSize > 10 ? 10 : fontSize,
                  },
                ]}
              >
                {LobbyTypeNames[lobbyTypeValue]}
              </TextComponent>
              <TextComponent
                weight="bold"
                style={[styles.textList, { color: colorTheme.dark }]}
              >
                {GameModeNames[gameModeValue]}
              </TextComponent>
            </View>
            <View style={{ flex: 1 }}>
              <TextComponent weight="semibold" style={styles.textList}>
                {formattedDuration}
              </TextComponent>
            </View>
            <View style={{ flex: 1.5 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <TextComponent
                  weight="semibold"
                  style={[styles.textList, { color: "#268626" }]}
                >
                  {item.kills}/
                </TextComponent>
                <TextComponent
                  weight="semibold"
                  style={[styles.textList, { color: "#9a0c28" }]}
                >
                  {item.deaths}/
                </TextComponent>
                <TextComponent
                  weight="semibold"
                  style={[styles.textList, { color: "#ff8f05" }]}
                >
                  {item.assists}
                </TextComponent>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  height: 3,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#268626",
                    flex: item.kills,
                    borderTopLeftRadius: 3,
                    borderBottomLeftRadius: 3,
                  }}
                />
                <View
                  style={{
                    backgroundColor: "#9a0c28",
                    flex: item.deaths,
                    borderTopLeftRadius: killsWidth === "0%" ? 3 : 0,
                    borderBottomLeftRadius: killsWidth === "0%" ? 3 : 0,
                  }}
                />
                <View
                  style={{
                    backgroundColor: "#ff8f05",
                    flex: item.assists,
                    borderTopRightRadius: 3,
                    borderBottomRightRadius: 3,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [playerId, colorTheme]
  );

  return (
    <View style={styles.flatListContainer}>
      <View style={styles.listTitle}>
        <TextComponent
          weight="bold"
          style={[styles.textTitleHeader, { width: "13%" }]}
        >
          {englishLanguage ? "Hero" : "Herói"}
        </TextComponent>
        <TextComponent
          weight="bold"
          style={[styles.textTitleHeader, { width: "40%" }]}
        >
          {englishLanguage ? "Date/Time" : "Data/Hora"}
        </TextComponent>
        <TextComponent
          weight="bold"
          style={[styles.textTitleHeader, { width: "17%" }]}
        >
          {englishLanguage ? "Mode" : "Modo"}
        </TextComponent>
        <TextComponent
          weight="bold"
          style={[styles.textTitleHeader, { width: "15%" }]}
        >
          {englishLanguage ? "Duration" : "Duração"}
        </TextComponent>
        <TextComponent
          weight="bold"
          style={[styles.textTitleHeader, { width: "13%" }]}
        >
          K/D/A
        </TextComponent>
      </View>
      <FlatList
        data={recentMatches}
        renderItem={renderItem}
        keyExtractor={(item: RecentMatches) => item.match_id.toString()}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews
        indicatorStyle="black"
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refresh}
            colors={[
              colorTheme.light,
              colorTheme.semilight,
              colorTheme.standard,
            ]}
            progressBackgroundColor={colorTheme.dark}
          />
        }
      />
    </View>
  );
}

export const LastMatches = React.memo(LastMatchesComponent);
LastMatches.displayName = "LastMatches";

import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  Dimensions,
  DimensionValue,
  Animated,
} from "react-native";
import { createStyles } from "./LastMatchesStyles";
import {
  GameModeNames,
  HeroDetailsModel,
  LobbyTypeNames,
  RecentMatches,
} from "../../../services/props";

import HeroesDetails from "@src/components/Heroes/HeroesDetails.json";
import { PICTURE_HERO_BASE_URL } from "@src/constants/player";
import { useTheme } from "@src/context/useThemeContext";
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
  const { ColorTheme } = useTheme();

  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];

  const styles = createStyles(ColorTheme);

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
        lobbyType: lobbyType,
        gameMode: gameMode,
      },
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

    const formattedTime = formatStartTime(item.start_time);
    const formattedDuration = formatDuration(item.duration);

    const { killsWidth, deathsWidth, assisWidth } = overviewBar(
      item.kills,
      item.deaths,
      item.assists
    );

    const lobbyTypeValue = item.lobby_type as LobbyType;
    const gameModeValue = item.game_mode as GameMode;

    const team = item.player_slot < 5 ? 1 : 2;
    const finalResult =
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
        <TextComponent
          weight="bold"
          style={[
            styles.textList,
            {
              color: finalResult ? "#268626" : "#9a0c28",
              width: "7%",
            },
          ]}
        >
          {finalResult ? (
            <MaterialIcons name="thumb-up" size={15} color="#268626" />
          ) : (
            <MaterialIcons name="thumb-down" size={15} color="#9a0c28" />
          )}
        </TextComponent>
        <TextComponent
          weight="bold"
          style={[
            styles.textList,
            { width: "28%", fontFamily: "QuickSand-Semibold" },
          ]}
        >
          {startDate.toLocaleDateString(englishLanguage ? "en-US" : "pt-BR")}-
          {formattedTime}
        </TextComponent>
        <View style={{ width: "25%" }}>
          <TextComponent
            weight="bold"
            style={[
              styles.textList,
              {
                color: ColorTheme.semilight,
                fontSize: Dimensions.get("screen").width * 0.02,
              },
            ]}
          >
            {LobbyTypeNames[lobbyTypeValue]}
          </TextComponent>
          <TextComponent
            weight="bold"
            style={[styles.textList, { color: ColorTheme.dark }]}
          >
            {GameModeNames[gameModeValue]}
          </TextComponent>
        </View>
        <TextComponent
          weight="semibold"
          style={[styles.textList, { width: "10%" }]}
        >
          {formattedDuration}
        </TextComponent>
        <View style={{ width: "15%" }}>
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
              style={[styles.textList, { color: "#c88304" }]}
            >
              {item.assists}
            </TextComponent>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: 3,
            }}
          >
            <View
              style={{
                backgroundColor: "#268626",
                width: killsWidth as DimensionValue,
                borderTopLeftRadius: 3,
                borderBottomLeftRadius: 3,
              }}
            />
            <View
              style={{
                backgroundColor: "#9a0c28",
                width: deathsWidth as DimensionValue,
                borderTopLeftRadius: killsWidth === "0%" ? 3 : 0,
                borderBottomLeftRadius: killsWidth === "0%" ? 3 : 0,
              }}
            />
            <View
              style={{
                backgroundColor: "#c88304",
                width: assisWidth as DimensionValue,
                borderTopRightRadius: 3,
                borderBottomRightRadius: 3,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
        initialNumToRender={20}
        indicatorStyle="black"
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
    </View>
  );
}

export const LastMatches = React.memo(LastMatchesComponent);
LastMatches.displayName = "LastMatches";

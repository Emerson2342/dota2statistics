import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";

import { createStylesStatics } from "./ProMatchesStyles";

import { LeagueMatches } from "@src/services/props";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ActivityIndicatorCustom } from "@src/components/ActivityIndicatorCustom";
import { TeamSide } from "@src/services/enum";
import { TextComponent } from "@src/components/TextComponent";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";
import { LinearGradientComponent } from "@src/components/LinearGradient";

const WIN = "#257848";
const LOS = "#9a2525";

function ProMatchesComponent({
  proMatches,
  onRefresh,
}: {
  proMatches: LeagueMatches[] | [];
  onRefresh: () => Promise<void>;
}) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const { englishLanguage } = useSettingsStore();
  const colorTheme = useThemeStore((state) => state.colorTheme);

  const styles = createStylesStatics(colorTheme);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const radName = englishLanguage ? "Radiant" : "Iluminados";
  const direName = englishLanguage ? "Dire" : "Temidos";

  const refresh = useCallback(async () => {
    console.log("Refresh pro matches");
    setLoading(true);
    await onRefresh();
    setLoading(false);
  }, []);

  const formattedTimeMatch = useMemo(() => {
    return proMatches.map((item) => {
      const durationInMinutes = item?.duration;
      const startHour = Math.floor(durationInMinutes / 60);
      const startMinutes = durationInMinutes % 60;

      const formattedHours = String(startHour).padStart(2, "0");
      const formattedMinutes = String(startMinutes).padStart(2, "0");
      const formattedDuration = `${formattedHours}min ${formattedMinutes}s`;

      const matchEndTime = item?.start_time + item?.duration;
      const timeSinceEnd = currentTimestamp - matchEndTime;
      const hours = Math.floor(timeSinceEnd / 3600);
      const minutes = Math.floor((timeSinceEnd % 3600) / 60);

      const formattedEndHours = String(hours).padStart(2, "0");
      const formattedEndMinutes = String(minutes).padStart(2, "0");
      const formattedEndDuration =
        formattedEndHours === "00"
          ? `${formattedEndMinutes}min`
          : `${formattedEndHours}h${formattedEndMinutes}min`;

      return { ...item, formattedEndDuration, formattedDuration };
    });
  }, [proMatches, currentTimestamp]);

  const handleGoToMatch = (matchId: number) => {
    router.push({
      pathname: "/match-details",
      params: {
        matchDetailsId: matchId,
      },
    });
  };

  const handleGoToLeagueMatches = (
    leagueId: number,
    leagueName: string | null
  ) => {
    router.push({
      pathname: "/league-matches",
      params: {
        leagueId: leagueId,
        leagueName: leagueName ?? "",
      },
    });
  };

  const TeamName = useCallback(
    ({ item, team }: { item: LeagueMatches; team: TeamSide }) => {
      const isRadiant = team === TeamSide.Radiant;

      const isWinner = isRadiant ? !!item.radiant_win : !item.radiant_win;

      const colorText = isWinner ? WIN : LOS;

      const itemName = isRadiant
        ? item.radiant_name || radName
        : item.dire_name || direName;

      const itemScore =
        team === TeamSide.Radiant ? item.radiant_score : item.dire_score;

      const rowStyle = [
        styles.teamRow,
        isRadiant && { flexDirection: "row-reverse" as const },
      ];

      return (
        <View style={rowStyle}>
          <TextComponent
            weight="semibold"
            style={[styles.score, { color: colorText }]}
          >
            {itemScore}
          </TextComponent>

          <TextComponent
            weight="semibold"
            style={[styles.teamName, { color: colorText }]}
            numberOfLines={1}
          >
            {itemName}
          </TextComponent>
        </View>
      );
    },
    [englishLanguage, proMatches]
  );

  const ProMatchItem = useCallback(
    ({
      item,
      formattedEndDuration,
      formattedDuration,
    }: {
      item: LeagueMatches;
      formattedEndDuration: string;
      formattedDuration: string;
    }) => {
      return (
        <View key={item.match_id} style={styles.matchContainer}>
          <View style={{ flexDirection: "row" }}>
            <TextComponent
              weight="bold"
              style={styles.leagueName}
              numberOfLines={1}
            >
              {item.league_name}
            </TextComponent>
          </View>
          <View
            style={{
              flexDirection: "row",
              // width: "100%",
            }}
          >
            <TeamName item={item} team={TeamSide.Radiant} />
            <TeamName item={item} team={TeamSide.Dire} />
          </View>
          <View style={styles.timeContainer}>
            <TextComponent weight="semibold" style={styles.textData}>
              {englishLanguage ? "Duration: " : "Duração: "}
              {formattedDuration}
            </TextComponent>

            <TextComponent weight="semibold" style={styles.textData}>
              {englishLanguage
                ? `Finished ${formattedEndDuration} ago`
                : `Finalizado ${formattedEndDuration} atrás`}
            </TextComponent>
          </View>
          <View style={styles.linkContainer}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <TouchableOpacity
                onPress={() =>
                  handleGoToLeagueMatches(item.leagueid, item.league_name)
                }
                style={styles.buttonContainer}
              >
                <TextComponent weight="bold" style={styles.textButton}>
                  {englishLanguage ? "Tournament " : "Campeonato "}
                  <Feather name="external-link" />
                </TextComponent>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => handleGoToMatch(item.match_id)}
                style={styles.buttonContainer}
              >
                <TextComponent weight="bold" style={styles.textButton}>
                  {englishLanguage ? "Match " : "Partida "}
                  <Feather name="external-link" />
                </TextComponent>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [proMatches, englishLanguage]
  );

  if (loading)
    return (
      <View style={styles.container}>
        <TextComponent weight="bold" style={styles.textHeader}>
          {englishLanguage ? "Pro Matches" : "Partidas Profissionais"}
        </TextComponent>
        <ActivityIndicatorCustom
          message={
            englishLanguage
              ? "Loading Pro Matches..."
              : "Carregando Partidas Profissionais..."
          }
        />
      </View>
    );

  return (
    <View style={styles.container}>
      <TextComponent weight="semibold" style={styles.textHeader}>
        {englishLanguage ? "Pro Matches" : "Partidas Profissionais"}
      </TextComponent>

      <ScrollView
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
      >
        <FlatList
          data={formattedTimeMatch}
          renderItem={({ item }) => (
            <ProMatchItem
              item={item}
              formattedEndDuration={item.formattedEndDuration}
              formattedDuration={item.formattedDuration}
            />
          )}
          keyExtractor={(item) => item.match_id.toString()}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          removeClippedSubviews
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}

export const ProMatches = React.memo(ProMatchesComponent);
ProMatches.displayName = "ProMatches";

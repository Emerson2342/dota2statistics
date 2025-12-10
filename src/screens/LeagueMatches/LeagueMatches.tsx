import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, FlatList } from "react-native";

import { createStyles } from "./LeagueMatchesStyles";
import { useTheme } from "@src/context/useThemeContext";
import { LeagueMatches } from "@src/services/props";
import { LEAGUES_BASE_URL } from "@src/constants/player";
import { useSettingsContext } from "@src/context/useSettingsContext";
import { fetchData } from "@src/services/api";
import { useRouter } from "expo-router";
import { ActivityIndicatorCustom } from "@src/utils/ActivityIndicatorCustom";
import { TextComponent } from "@src/components/TextComponent";
import { useTeamStore } from "@src/store/teamsList";
import { useShallow } from "zustand/react/shallow";

type LeagueDetailsProps = {
  LeagueIdIndex: number;
  LeagueName: string;
};

export function LeagueMatchesScreen({
  LeagueIdIndex,
  LeagueName,
}: LeagueDetailsProps) {
  const route = useRouter();

  const { ColorTheme } = useTheme();

  const styles = createStyles(ColorTheme);
  const [leagueMatches, setLeagueMatches] = useState<LeagueMatches[] | []>([]);

  const [isLoading, setIsLoading] = useState(false);
  const { englishLanguage } = useSettingsContext();
  const { teamsList, loading, fetchTeams } = useTeamStore(
    useShallow((state) => ({
      teamsList: state.teamsList,
      loading: state.loading,
      fetchTeams: state.fetchTeams,
    }))
  );

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchTeams();
      await handleLoadLeagueMatches();
      setIsLoading(false);
    };
    const handleLoadLeagueMatches = async () => {
      const searchLeagues = `${LEAGUES_BASE_URL}${LeagueIdIndex}/matches`;

      await fetchData<LeagueMatches[]>(searchLeagues)
        .then((res) => setLeagueMatches(res))
        .catch(() => console.error("Error trying to get League Matches"));
    };
    load();
  }, []);

  useEffect(() => {}, []);

  const handleGoToMatch = (matchId: number) => {
    route.push({
      pathname: "match-details",
      params: {
        matchDetailsId: matchId,
      },
    });
  };

  const groupBySeriesId = (matches: LeagueMatches[] = []) => {
    return matches.reduce((acc, match) => {
      if (!acc[match.series_id]) {
        acc[match.series_id] = [];
      }
      acc[match.series_id].push(match);
      return acc;
    }, {} as { [key: number]: LeagueMatches[] });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: LeagueMatches;
    index: number;
  }) => {
    const date = new Date(item.start_time * 1000).toLocaleString("pt-BR");

    const hours = Math.floor(item.duration / 3600);
    const minutes = Math.floor((item.duration % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(item.duration % 60)
      .toString()
      .padStart(2, "0");

    const teamRad = teamsList.find(
      (team) => team.team_id == item.radiant_team_id
    );
    const teamDire = teamsList.find(
      (team) => team.team_id == item.dire_team_id
    );

    return (
      <TouchableOpacity
        style={[
          {
            borderTopWidth: index == 0 ? 0 : 1,
            borderColor: "#ccc",
            paddingVertical: 7,
          },
        ]}
        onPress={() => handleGoToMatch(item.match_id)}
      >
        <View style={styles.teamContainer}>
          <View style={styles.singleTeamContainer}>
            <TextComponent
              weight="bold"
              style={[
                styles.teamName,
                { color: item.radiant_win ? "#2f6d4a" : "#893647" },
              ]}
            >
              {teamRad?.name ?? "Radiant Team"}
            </TextComponent>
            <TextComponent
              weight="bold"
              style={[
                styles.teamScore,
                { color: item.radiant_win ? "#2f6d4a" : "#893647" },
              ]}
            >
              {item.radiant_score}
            </TextComponent>
          </View>

          <View style={styles.singleTeamContainer}>
            <TextComponent
              weight="bold"
              style={[
                styles.teamScore,
                { color: item.radiant_win ? "#893647" : "#2f6d4a" },
              ]}
            >
              {item.dire_score}
            </TextComponent>
            <TextComponent
              weight="bold"
              style={[
                styles.teamName,
                { color: item.radiant_win ? "#893647" : "#2f6d4a" },
              ]}
            >
              {teamDire?.name ?? "Dire Team"}
            </TextComponent>
          </View>
        </View>
        <View style={styles.timeContent}>
          <TextComponent weight="semibold" style={styles.durationText}>
            <TextComponent weight="bold" style={{ color: "#555" }}>
              {englishLanguage ? "Duration: " : "Duração: "}
            </TextComponent>
            {hours > 0 ? hours + ":" : ""}
            {minutes}:{seconds}
          </TextComponent>
          <TextComponent weight="semibold" style={styles.durationText}>
            <TextComponent weight="bold" style={{ color: "#555" }}>
              {englishLanguage ? "Date: " : "Data: "}
            </TextComponent>
            {date}
          </TextComponent>
        </View>
      </TouchableOpacity>
    );
  };

  const groupedMatches = groupBySeriesId(leagueMatches);

  const sortedGroupedMatches = Object.entries(groupedMatches).sort(
    ([idA], [idB]) => parseInt(idB) - parseInt(idA)
  );

  const renderGroupedMatches = sortedGroupedMatches.map(
    ([seriesId, matches]) => (
      <View key={seriesId} style={styles.matchesGroup}>
        {matches.map((match, index) => (
          <View key={match.match_id}>{renderItem({ item: match, index })}</View>
        ))}
      </View>
    )
  );

  if (isLoading) {
    return (
      <ActivityIndicatorCustom
        message={
          englishLanguage
            ? "Loading League Matches..."
            : "Carregando Partidas do Campeonato..."
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <TextComponent weight="bold" style={styles.titleText}>
        {LeagueName}
      </TextComponent>
      {renderGroupedMatches.length > 0 ? (
        <FlatList
          data={renderGroupedMatches}
          renderItem={({ item }) => item}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
        />
      ) : (
        <View style={styles.containerEmpty}>
          <TextComponent weight="bold" style={styles.emptyText}>
            {englishLanguage ? "No Matches Found" : "Nenhum partida encontrada"}
          </TextComponent>
        </View>
      )}
    </View>
  );
}

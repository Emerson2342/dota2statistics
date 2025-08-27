import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";

import { createStyles } from "./LeagueMatchesStyles";
import { useTheme } from "../../context/useThemeContext";
import {
  LeagueMatches,
  RootStackParamList,
  MatchLeagueInfo,
  FontModel,
} from "../../services/props";
import { LEAGUES_BASE_URL } from "../../constants/player";
import { useTeamsListContext } from "../../context/useTeamContext";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useFonts } from "expo-font";
import { BannerAds } from "../../components/Admob/BannerAds";
import { getSearchLeagueMatches } from "../../services/api";
import { useRouter } from "expo-router";

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
  const [leagueMatches, setLeagueMatches] = useState<LeagueMatches[]>([]);
  const { teamsList } = useTeamsListContext();
  const [isLoading, setIsLoading] = useState(false);
  const { englishLanguage } = useSettingsContext();
  const result = englishLanguage ? "Winner" : "Vencedor";

  useEffect(() => {
    const handleLoadLeagueMatches = async () => {
      setIsLoading(true);
      const searchLeagues = `${LEAGUES_BASE_URL}${LeagueIdIndex}/matches`;
      await getSearchLeagueMatches(searchLeagues, setLeagueMatches);
      setIsLoading(false);
    };
    handleLoadLeagueMatches();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: ColorTheme.light,
        }}
      >
        <ActivityIndicator size={30} color={ColorTheme.semidark} />
        <Text
          style={{
            paddingTop: "3%",
            color: ColorTheme.dark,
            fontFamily: "QuickSand-Bold",
          }}
        >
          {englishLanguage ? "Loading.." : "Carregando..."}
        </Text>
        <View style={{ alignSelf: "flex-end" }}>
          <BannerAds />
        </View>
      </View>
    );
  }

  const handleGoToMatch = (matchId: number) => {
    route.push({
      pathname: "match-details",
      params: {
        MatchDetailsIndex: matchId,
      },
    });
  };

  const groupBySeriesId = (matches: LeagueMatches[]) => {
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
          },
        ]}
        onPress={() => handleGoToMatch(item.match_id)}
      >
        <View style={styles.resultContainer}>
          <Text style={styles.textResult}>
            {item.radiant_win ? result : ""}
          </Text>
          <Text style={styles.textResult}>
            {item.radiant_win ? "" : result}
          </Text>
        </View>
        <View style={styles.teamContainer}>
          <View style={styles.singleTeamContainer}>
            <Text style={styles.teamName}>
              {teamRad?.name ?? "Radiant Team"}
            </Text>
            <Text style={styles.teamScore}>{item.radiant_score}</Text>
          </View>

          <View style={styles.singleTeamContainer}>
            <Text style={styles.teamScore}>{item.dire_score}</Text>
            <Text style={styles.teamName}>{teamDire?.name ?? "Dire Team"}</Text>
          </View>
        </View>
        <View style={styles.timeContent}>
          <Text style={styles.durationText}>
            <Text style={{ color: "#aaa" }}>
              {englishLanguage ? "Duration: " : "Duração: "}
            </Text>
            {hours > 0 ? hours + ":" : ""}
            {minutes}:{seconds}
          </Text>
          <Text style={styles.durationText}>
            <Text style={{ color: "#aaa" }}>
              {englishLanguage ? "Date: " : "Data: "}
            </Text>
            {date}
          </Text>
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

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{LeagueName}</Text>
      {renderGroupedMatches.length > 0 ? (
        <FlatList
          data={renderGroupedMatches}
          renderItem={({ item }) => item}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
        />
      ) : (
        <View style={styles.containerEmpty}>
          <Text style={styles.emptyText}>
            {englishLanguage ? "No Matches Found" : "Nenhum partida encontrada"}
          </Text>
        </View>
      )}
      <BannerAds />
    </View>
  );
}

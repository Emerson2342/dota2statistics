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
  LeagueDetailsProps,
  RootStackParamList,
  MatchLeagueInfo,
  FontModel,
} from "../../services/props";
import { LEAGUES_BASE_URL } from "../../constants/player";
import { useTeamsListContext } from "../../context/useTeamContext";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { BannerAds } from "../../components/BannerAds";

export function LeagueDetails({ route }: LeagueDetailsProps) {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "MatchDetails">>();
  const { LeagueIdIndex, LeagueName } = route.params;

  const { ColorTheme } = useTheme();

  const [fontsLoaded] = useFonts({
    "QuickSand-Regular": require("../../Fonts/Quicksand_Regular.ttf"),
    "QuickSand-Semibold": require("../../Fonts/Quicksand_SemiBold.ttf"),
    "QuickSand-Bold": require("../../Fonts/Quicksand_SemiBold.ttf"),
  });

  const Font: FontModel = {
    font1: "QuickSand-Semibold",
    font2: "QuickSand-Bold",
    font3: "QuickSand-Regular",
  };

  const styles = createStyles(ColorTheme, Font);

  const [leagueMatches, setLeagueMatches] = useState<LeagueMatches[]>([]);
  const [matchInfo, setMatchInfo] = useState<MatchLeagueInfo>({
    RadName: undefined,
    DireName: undefined,
    LeagueName: LeagueName,
  });

  const { teamsList } = useTeamsListContext();

  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState(false);
  const [erroMessage, setErrorMessage] = useState<string>("");

  const { englishLanguage } = useSettingsContext();

  const result = englishLanguage ? "Winner" : "Vencedor";

  const getSearchLeagueMatches = async (url: any) => {
    try {
      setIsLoading(true);
      const response = await fetch(url);
      const data = (await response.json()) as LeagueMatches[];
      setLeagueMatches(data);
    } catch (error: any) {
      setErrorMessage(error);
      setModalMessage(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const handleLoadLeagueMatches = () => {
      const searchLeagues = `${LEAGUES_BASE_URL}${LeagueIdIndex}/matches`;
      console.log(searchLeagues);
      getSearchLeagueMatches(searchLeagues);
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
        <Text style={{ paddingTop: "3%", color: ColorTheme.dark }}>
          {englishLanguage ? "Loading.." : "Carregando..."}
        </Text>
        <View style={{ alignSelf: "flex-end" }}>
          <BannerAds />
        </View>
      </View>
    );
  }

  const handleGoToMatch = (
    matchIndex: number,
    leagueName: string | null,
    radName: string | undefined,
    direName: string | undefined
  ) => {
    navigation.navigate("MatchDetails", {
      MatchDetailsIndex: matchIndex,
      PlayerIdIndex: null,
      RadiantName: radName || undefined,
      DireName: direName || undefined,
      LeagueNameIndex: leagueName || null,
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
    const teamRadUrl = teamsList.find(
      (t) => t.team_id === item.radiant_team_id
    );
    const teamDireUrl = teamsList.find((t) => t.team_id === item.dire_team_id);

    const urlRad = teamRadUrl?.logo_url;
    const urlDire = teamDireUrl?.logo_url;

    return (
      <TouchableOpacity
        style={[
          {
            borderTopWidth: index == 0 ? 0 : 1,
            borderColor: "#ccc",
          },
        ]}
        onPress={() =>
          handleGoToMatch(
            item.match_id,
            LeagueName,
            teamRad?.name,
            teamDire?.name
          )
        }
      >
        <View style={styles.resultContainer}>
          <Text style={styles.textResult}>
            {item.radiant_win ? result : ""}
          </Text>
          <Text style={styles.textResult}>
            {item.radiant_win ? "" : result}
          </Text>
        </View>
        <View
          style={[
            styles.imageContainer,
            {
              display:
                urlRad == undefined && urlDire == undefined ? "none" : "flex",
            },
          ]}
        >
          <View style={styles.imageContent}>
            {urlRad ? (
              <Image
                style={styles.imageTeam}
                source={{ uri: urlRad }}
                resizeMode="contain"
                onError={(e) =>
                  console.log("Erro ao carregar imagem:", e.nativeEvent.error)
                }
              />
            ) : (
              <View style={styles.imageTeam} />
            )}
          </View>
          <View style={styles.imageContent}>
            {urlDire ? (
              <Image
                style={styles.imageTeam}
                source={{ uri: urlDire }}
                resizeMode="contain"
                onError={(e) =>
                  console.log("Erro ao carregar imagem:", e.nativeEvent.error)
                }
              />
            ) : (
              <View style={styles.imageTeam} />
            )}
          </View>
        </View>
        <View style={styles.teamContainer}>
          <View style={styles.singleTeamContainer}>
            <Text style={[styles.teamName, {}]}>
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
      <FlatList
        data={renderGroupedMatches}
        renderItem={({ item }) => item}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
      />
      <BannerAds />
    </View>
  );
}

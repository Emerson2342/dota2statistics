import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, useWindowDimensions, Dimensions } from "react-native";
import { createStyles } from "./styles";
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import { TabView, TabBar } from "react-native-tab-view";
import { HeroDetailsModel, MatchDetailsModel } from "@src/services/props";
import { MATCHE_DETAILS_API_BASE_URL } from "@src/constants/player";
import { getMatchDetails } from "@src/services/api";
import { AsyncStorageService } from "@src/services/StorageService";
import { HeroesDetailsTabs } from "./HeroDetailsTabs";
import { OverViewTabs } from "./OverViewTabs";
import { ActivityIndicatorCustom } from "@src/components/ActivityIndicatorCustom";
import { useTeamFightsStore } from "@src/store/teamFights";
import { TextComponent } from "@src/components/TextComponent";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";
import { ErrorComponent } from "@src/components/ErrorComponent";

type MatchDetailsProps = {
  matchDetailsIndex: string;
  playerIdIndex?: string;
  lobbyType?: string;
  gameMode?: string;
};
const fontSize = Dimensions.get("screen").width * 0.03;

export const MatchDetailsScreen = ({
  matchDetailsIndex,
  playerIdIndex,
  lobbyType,
  gameMode,
}: MatchDetailsProps) => {
  const layout = useWindowDimensions();
  const { englishLanguage } = useSettingsStore();
  const [matchesDetailsList, setMatchesDetailsList] = useState<
    MatchDetailsModel[]
  >([]);
  const setTeamFightsData = useTeamFightsStore((state) => state.setData);
  const [apiResponseMatch, setApiResponseMatch] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(true);

  const [loadedeList, setLoadedList] = useState(false);

  const storage = useMemo(() => new AsyncStorageService(), []);

  const [refreshing, setRefreshing] = useState(false);

  const colorTheme = useThemeStore((state) => state.colorTheme);

  const [matchDetails, setMatchDetails] = useState<MatchDetailsModel | null>(
    null
  );

  const [index, setIndex] = useState(0);

  const teamFightsMemo = useMemo(
    () => matchDetails?.teamfights ?? [],
    [matchDetails?.teamfights]
  );
  const styles = useMemo(() => createStyles(colorTheme), [colorTheme]);

  const radName = useMemo(
    () => (englishLanguage ? "Radiant" : "Iluminados"),
    [englishLanguage]
  );
  const direName = useMemo(
    () => (englishLanguage ? "Dire" : "Temidos"),
    [englishLanguage]
  );

  const heroArray = useMemo(
    () => Object.values(HeroesDetails) as HeroDetailsModel[],
    []
  );

  const heroMap = useMemo(() => {
    return heroArray.reduce((acc, hero) => {
      acc[hero.id] = hero.name;
      return acc;
    }, {} as Record<number, string>);
  }, [heroArray]);

  const heroNamesMemo = useMemo(() => {
    const players = matchDetails?.players;
    if (!players) return [];
    return players.map((p) => heroMap[p.hero_id]);
  }, [matchDetails?.players, heroMap]);

  useEffect(() => {
    if (!matchDetails) return;
  }, [matchDetails]);

  useEffect(() => {
    const loadMatchesList = async () => {
      try {
        const storedMatchesList = await storage.getItem<MatchDetailsModel[]>(
          "matchesDetailsList"
        );
        if (storedMatchesList) {
          setMatchesDetailsList((prevList) => {
            if (
              JSON.stringify(prevList) !== JSON.stringify(storedMatchesList)
            ) {
              return storedMatchesList;
            }
            return prevList;
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage:", error);
      } finally {
        setLoadedList(true);
      }
    };
    loadMatchesList();
  }, []);
  useEffect(() => {
    if (!matchDetails) return;

    setTeamFightsData({
      teamFights: teamFightsMemo,
      heroNames: heroNamesMemo,
      radTeamName: matchDetails.radiant_team?.name ?? radName,
      direTeamName: matchDetails.dire_team?.name ?? direName,
      update: onRefreshCallback,
    });
  }, [matchDetails, teamFightsMemo, heroNamesMemo, radName, direName]);

  useEffect(() => {
    if (loadedeList && matchesDetailsList.length > 0) {
      saveMatchesDetailsList();
    }
  }, [matchesDetailsList, loadedeList]);

  useEffect(() => {
    if (!loadedeList) return;
    fetchMatchDetails();
  }, [matchDetailsIndex, loadedeList]);

  const fetchMatchDetails = async () => {
    const match =
      matchDetailsIndex &&
      matchesDetailsList.find(
        (m: MatchDetailsModel) => m.match_id === Number(matchDetailsIndex)
      );
    if (match) {
      console.log(
        "Partida Encontrada ID: " +
          matchDetailsIndex +
          " - Tamanho da Lista: " +
          matchesDetailsList.length
      );
      setMatchDetails(match);
      setLoadingMatch(false);
    } else {
      await handleSearchMatche();
    }
  };

  const hasTeamFights = !!matchDetails?.teamfights?.length;

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return (
          <OverViewTabs
            GameMode={gameMode}
            LobbyType={lobbyType}
            PlayerIdIndex={playerIdIndex}
            radName={matchDetails?.radiant_team?.name ?? radName}
            direName={matchDetails?.dire_team?.name ?? direName}
            heroArray={heroArray}
            matchDetails={matchDetails}
            onRefresh={onRefreshCallback}
            refreshing={refreshing}
            key={matchDetails?.match_id}
            hasTeamFights={hasTeamFights}
          />
        );
      case "second":
        return (
          <HeroesDetailsTabs
            matchDetails={matchDetails}
            onRefresh={async () => await onRefreshCallback()}
            refreshing={refreshing}
            radName={matchDetails?.radiant_team?.name ?? radName}
            direName={matchDetails?.dire_team?.name ?? direName}
            heroArray={heroArray}
            key={playerIdIndex}
          />
        );
      default:
        return (
          <ActivityIndicatorCustom
            message={
              englishLanguage
                ? "Loading Match Details..."
                : "Carregando Detalhes da Partida..."
            }
          />
        );
    }
  };
  const onRefreshCallback = useCallback(async () => {
    setRefreshing(true);
    const match =
      matchDetailsIndex &&
      matchesDetailsList.find(
        (m: MatchDetailsModel) => m.match_id === Number(matchDetailsIndex)
      );
    if (match) {
      setMatchDetails(null);
      const prevList = matchesDetailsList.filter(
        (m) => m.match_id != match.match_id
      );
      setMatchesDetailsList(prevList);
      await handleSearchMatche();
    }
    setIndex(0);
    setRefreshing(false);
  }, [matchDetailsIndex, matchesDetailsList, handleSearchMatche]);

  const allRoutes = [
    { key: "first", title: englishLanguage ? "Overview" : "Resumo" },
    {
      key: "second",
      title: englishLanguage ? "Hero Details" : "Detalhes por Herói",
    },
  ];

  const saveMatchesDetailsList = async () => {
    try {
      await storage.setItem("matchesDetailsList", matchesDetailsList);
    } catch (error) {
      console.error("Erro ao salvar dados no AsyncStorage:", error);
    }
  };

  async function handleSearchMatche() {
    setApiResponseMatch(false);
    try {
      setLoadingMatch(true);
      const recentMatchesUrl = `${MATCHE_DETAILS_API_BASE_URL}${matchDetailsIndex}`;
      const matchDataResponse = await getMatchDetails(recentMatchesUrl);
      if (matchDataResponse) {
        setMatchDetails(matchDataResponse);
        addMatchToList(matchDataResponse);
        console.log("Partida buscada no servidor ID: " + matchDetailsIndex);
      }
      setApiResponseMatch(true);
    } catch (error) {
      console.log(
        "Erro ao buscar detalhes da partida: ID " + matchDetailsIndex,
        error
      );
    } finally {
      setLoadingMatch(false);
    }
  }

  const addMatchToList = (match: MatchDetailsModel) => {
    setMatchesDetailsList((prevList) => {
      const updatedList = [...prevList, match];
      if (updatedList.length > 20) {
        return updatedList.slice(1);
      }
      return updatedList;
    });
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: "orange",
      }}
      activeColor={"#fff"}
      inactiveColor={"#888"}
      style={{
        backgroundColor: colorTheme.semidark,
      }}
    />
  );

  if (loadingMatch)
    return (
      <ActivityIndicatorCustom
        message={
          englishLanguage
            ? "Loading Match Details..."
            : "Carregando Detalhes da Partida..."
        }
      />
    );
  if (!matchDetails && apiResponseMatch)
    return <ErrorComponent action={fetchMatchDetails} />;

  if (matchDetails)
    return (
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes: allRoutes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy
        lazyPreloadDistance={2}
        commonOptions={{
          labelStyle: {
            fontSize: fontSize,
            fontFamily: "QuickSand-Bold",
            textAlign: "center",
          },
        }}
      />
    );
  //return null;
};

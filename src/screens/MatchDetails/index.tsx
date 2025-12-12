import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, useWindowDimensions, Dimensions } from "react-native";
import { createStyles } from "./styles";
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import { TabView, TabBar } from "react-native-tab-view";
import { HeroDetailsModel, MatchDetailsModel } from "@src/services/props";
import { MATCHE_DETAILS_API_BASE_URL } from "@src/constants/player";
import { useTheme } from "@src/context/useThemeContext";
import { getMatchDetails } from "@src/services/api";
import { AsyncStorageService } from "@src/services/StorageService";
import { HeroesDetailsTabs } from "./HeroDetailsTabs";
import { OverViewTabs } from "./OverViewTabs";
import { ActivityIndicatorCustom } from "@src/components/ActivityIndicatorCustom";
import { useTeamFightsStore } from "@src/store/teamFights";
import { TextComponent } from "@src/components/TextComponent";
import { useSettingsStore } from "@src/store/settings";

type MatchDetailsProps = {
  matchDetailsIndex: string;
  playerIdIndex?: string;
  lobbyType?: string;
  gameMode?: string;
};

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
  const [apiResponseMatch, setApiResponseMatch] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(true);

  const [loadedeList, setLoadedList] = useState(false);

  const storage = useMemo(() => new AsyncStorageService(), []);

  const [refreshing, setRefreshing] = useState(false);

  const { ColorTheme } = useTheme();

  const [matchDetails, setMatchDetails] = useState<MatchDetailsModel | null>(
    null
  );
  const setTeamFightsData = useTeamFightsStore((state) => state.setData);

  const [index, setIndex] = useState(0);

  const textMatchId = englishLanguage
    ? "Match not found. Please, check the ID MATCH!"
    : "Partida não encontrada. Por favor, verifique o ID DA PARTIDA!";

  const teamFightsMemo = useMemo(
    () => matchDetails?.teamfights ?? [],
    [matchDetails?.teamfights]
  );
  const styles = useMemo(() => createStyles(ColorTheme), [ColorTheme]);

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
    fetchMatchDetails();
  }, [matchDetailsIndex, loadedeList]);

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
          //<Text>second</Text>
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
      //case "third":
      //return <Text>testes 3</Text>;
      //   return TeamFightComponent;
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

  /* const TeamFightComponent = useMemo(() => {
    return (
      <TeamFightsTabs
        heroNames={heroNamesMemo}
        teamFights={teamFightsMemo}
        radTeamName={matchDetails?.radiant_team?.name ?? radName}
        direTeamName={matchDetails?.dire_team?.name ?? direName}
        update={onRefreshCallback}
      />
    );
  }, [
    heroNamesMemo,
    teamFightsMemo,
    matchDetails?.radiant_team?.name,
    matchDetails?.dire_team?.name,
    onRefreshCallback,
    radName,
    direName,
  ]);
  */

  const allRoutes = [
    { key: "first", title: englishLanguage ? "Overview" : "Resumo" },
    {
      key: "second",
      title: englishLanguage ? "Hero Details" : "Detalhes por Herói",
    },
    //{ key: "third", title: "Team Fights" },
  ];
  // const hasTeamFights = !!matchDetails?.teamfights?.length;

  //const filteredRoutes = hasTeamFights
  // ? allRoutes
  //: allRoutes.filter((r) => r.key !== "third");

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
        backgroundColor: ColorTheme.semidark,
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
    return (
      <View style={styles.matchIdContainer}>
        <TextComponent weight="bold" style={styles.textMatchId}>
          {textMatchId}
        </TextComponent>
      </View>
    );

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
            fontSize: Dimensions.get("screen").width * 0.03,
            fontFamily: "QuickSand-Bold",
            textAlign: "center",
          },
        }}
      />
    );
  //return null;
};

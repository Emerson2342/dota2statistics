import React, { useState, useEffect, useMemo } from "react";
import { View, Text, useWindowDimensions, Dimensions } from "react-native";
import { createStyles } from "./styles";
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import { TabView, TabBar } from "react-native-tab-view";
import { HeroDetailsModel, MatchDetailsModel } from "../../services/props";
import { MATCHE_DETAILS_API_BASE_URL } from "../../constants/player";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { getMatchDetails } from "../../services/api";
import { AsyncStorageService } from "../../services/StorageService";
import { TeamFightsTabs } from "./TeamFightsTabs";
import { HeroesDetailsTabs } from "./HeroDetailsTabs";
import { OverViewTabs } from "./OverViewTabs";
import { ActivityIndicatorCustom } from "../../../src/utils/ActivityIndicatorCustom";

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
  const { englishLanguage } = useSettingsContext();
  const [matchesDetailsList, setMatchesDetailsList] = useState<
    MatchDetailsModel[]
  >([]);
  const [apiResponseMatch, setApiResponseMatch] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(true);

  const [loadedeList, setLoadedList] = useState(false);
  //Wconst [];
  const storage = useMemo(() => new AsyncStorageService(), []);

  const [refreshing, setRefreshing] = useState(false);

  const { ColorTheme } = useTheme();

  const [matchDetails, setMatchDetails] = useState<MatchDetailsModel | null>(
    null
  );

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const textMatchId = englishLanguage
    ? "Match not found. Please, check the ID MATCH!"
    : "Partida não encontrada. Por favor, verifique o ID DA PARTIDA!";

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

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return (
          //<Text>first</Text>
          <OverViewTabs
            GameMode={gameMode}
            LobbyType={lobbyType}
            PlayerIdIndex={playerIdIndex}
            direName={direName}
            radName={radName}
            heroArray={heroArray}
            matchDetails={matchDetails}
            onRefresh={onRefresh}
            refreshing={refreshing}
            key={matchDetails?.match_id}
          />
        );
      case "second":
        return (
          //<Text>second</Text>
          <HeroesDetailsTabs
            matchDetails={matchDetails}
            onRefresh={async () => await onRefresh()}
            refreshing={refreshing}
            radName={radName}
            direName={direName}
            heroArray={heroArray}
            key={playerIdIndex}
          />
        );
      case "third":
        return <TeamFightComponent />;
      //return <Text>testes 3</Text>;
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

  const TeamFightComponent = () => {
    const heroMap = useMemo(
      () => Object.fromEntries(heroArray.map((h) => [h.id, h.name])),
      [heroArray]
    );

    const heroNames = useMemo(
      () => matchDetails?.players.map((p) => heroMap[p.hero_id]) || [],
      [matchDetails, heroMap]
    );

    return (
      <TeamFightsTabs
        heroNames={heroNames}
        teamFights={matchDetails?.teamfights || []}
        radTeamName={matchDetails?.radiant_team?.name ?? radName}
        direTeamName={matchDetails?.dire_team?.name ?? direName}
        update={onRefresh}
      />
    );
  };

  const allRoutes = [
    { key: "first", title: englishLanguage ? "Overview" : "Resumo" },
    {
      key: "second",
      title: englishLanguage ? "Hero Details" : "Detalhes por Herói",
    },
    { key: "third", title: "Team Fights" },
  ];
  const hasTeamFights =
    matchDetails &&
    matchDetails.radiant_gold_adv &&
    matchDetails?.radiant_gold_adv.length > 0;

  const filteredRoutes = allRoutes.filter(
    (route) => route.key !== "third" || hasTeamFights
  );

  const onRefresh = async () => {
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
  };

  const radName = useMemo(
    () => (englishLanguage ? "Radiant" : "Iluminados"),
    [englishLanguage]
  );
  const direName = useMemo(
    () => (englishLanguage ? "Dire" : "Temidos"),
    [englishLanguage]
  );

  const styles = useMemo(() => createStyles(ColorTheme), [ColorTheme]);
  const heroArray = useMemo(
    () => Object.values(HeroesDetails) as HeroDetailsModel[],
    [HeroesDetails]
  );

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
        <Text style={styles.textMatchId}>{textMatchId}</Text>
      </View>
    );

  if (matchDetails)
    return (
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes: filteredRoutes }}
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

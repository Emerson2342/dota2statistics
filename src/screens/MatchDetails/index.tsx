import React, { useState, useEffect, useMemo } from "react";
import { useWindowDimensions, Dimensions, View } from "react-native";
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import { TabView, TabBar } from "react-native-tab-view";
import {
  GameModeNames,
  HeroDetailsModel,
  LobbyTypeNames,
} from "@src/services/props";
import { getMatchDetails } from "@src/services/api";
import { HeroesDetailsTabs } from "./HeroDetailsTabs";
import { OverViewTabs } from "./OverViewTabs";
import { ActivityIndicatorCustom } from "@src/components/ActivityIndicatorCustom";
import { useTeamFightsStore } from "@src/store/teamFights";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";
import { ErrorComponent } from "@src/components/ErrorComponent";
import { useQuery } from "@tanstack/react-query";
import { WaveTrendings } from "@src/components/Waves";
import { TextComponent } from "@src/components/TextComponent";
import { GameMode, LobbyType } from "@src/services/enum";

type MatchDetailsProps = {
  matchDetailsId: string;
  playerIdIndex?: string;
};
const fontSize = Dimensions.get("screen").width * 0.03;

export const MatchDetailsScreen = ({
  matchDetailsId,
  playerIdIndex,
}: MatchDetailsProps) => {
  const layout = useWindowDimensions();
  const { englishLanguage } = useSettingsStore();

  const setTeamFightsData = useTeamFightsStore((state) => state.setData);
  const colorTheme = useThemeStore((state) => state.colorTheme);

  const [index, setIndex] = useState(0);

  const text404 = englishLanguage
    ? "Match not found, please, check the match ID!"
    : "Partida não encontrada, por favor, verifique o ID da partida!";

  const textError = englishLanguage
    ? "Error trying to get the match, please, try again later!"
    : "Erro ao buscar a partida, por favor, tente novamente mais tarde";

  const matchDetailsQuery = useQuery({
    queryKey: ["matchDetails"],
    queryFn: () => getMatchDetails(matchDetailsId),
    staleTime: 0,
  });
  const matchDetails = matchDetailsQuery.data?.data;

  const teamFightsMemo = matchDetails?.teamfights ?? [];
  const isLoadingScreen =
    matchDetailsQuery.isLoading || matchDetailsQuery.isFetching;

  const radName = englishLanguage ? "Radiant" : "Iluminados";
  const direName = englishLanguage ? "Dire" : "Temidos";
  const hasTeamFights = !!matchDetails?.teamfights?.length;

  const lobbyTypeValue = matchDetails?.lobby_type as LobbyType;
  const gameModeValue = matchDetails?.game_mode as GameMode;

  useEffect(() => {
    if (!matchDetails) return;

    setTeamFightsData({
      teamFights: teamFightsMemo,
      heroNames: heroNamesMemo,
      radTeamName: matchDetails.radiant_team?.name ?? radName,
      direTeamName: matchDetails.dire_team?.name ?? direName,
      //update: matchDetailsQuery.refetch,
    });
  }, [matchDetails]);

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

  if (isLoadingScreen)
    return (
      <>
        <WaveTrendings />
        <ActivityIndicatorCustom
          message={
            englishLanguage
              ? "Loading Match Details..."
              : "Carregando Detalhes da Partida..."
          }
        />
      </>
    );
  if (matchDetailsQuery.data?.status === 404)
    return (
      <>
        <WaveTrendings />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TextComponent weight="bold">{text404}</TextComponent>
        </View>
      </>
    );

  if (matchDetailsQuery.data?.success == false)
    return <ErrorComponent action={() => matchDetailsQuery.refetch()} />;
  if (!matchDetails)
    return (
      <>
        <WaveTrendings />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <TextComponent>{textError}</TextComponent>
        </View>
      </>
    );

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return (
          <OverViewTabs
            GameMode={GameModeNames[gameModeValue].toString()}
            LobbyType={LobbyTypeNames[lobbyTypeValue].toString()}
            PlayerIdIndex={playerIdIndex}
            radName={matchDetails?.radiant_team?.name ?? radName}
            direName={matchDetails?.dire_team?.name ?? direName}
            heroArray={heroArray}
            matchDetails={matchDetails}
            onRefresh={matchDetailsQuery.refetch}
            refreshing={false}
            key={matchDetails?.match_id}
            hasTeamFights={hasTeamFights}
          />
        );
      case "second":
        return (
          <HeroesDetailsTabs
            matchDetails={matchDetails}
            onRefresh={matchDetailsQuery.refetch}
            refreshing={false}
            radName={matchDetails?.radiant_team?.name ?? radName}
            direName={matchDetails?.dire_team?.name ?? direName}
            heroArray={heroArray}
            key={playerIdIndex}
          />
        );
      default:
        return null;
    }
  };

  const allRoutes = [
    { key: "first", title: englishLanguage ? "Overview" : "Resumo" },
    {
      key: "second",
      title: englishLanguage ? "Hero Details" : "Detalhes por Herói",
    },
  ];
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

  if (matchDetails)
    return (
      <TabView
        lazy
        lazyPreloadDistance={1}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes: allRoutes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        commonOptions={{
          labelStyle: {
            fontSize: fontSize,
            fontFamily: "QuickSand-Bold",
            textAlign: "center",
          },
        }}
      />
    );
};

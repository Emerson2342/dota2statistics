import React, { useState, useEffect, useMemo } from "react";
import { useWindowDimensions, Dimensions } from "react-native";
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import { TabView, TabBar } from "react-native-tab-view";
import { HeroDetailsModel, MatchDetailsModel } from "@src/services/props";
import { getMatchDetails } from "@src/services/api";
import { HeroesDetailsTabs } from "./HeroDetailsTabs";
import { OverViewTabs } from "./OverViewTabs";
import { ActivityIndicatorCustom } from "@src/components/ActivityIndicatorCustom";
import { useTeamFightsStore } from "@src/store/teamFights";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";
import { ErrorComponent } from "@src/components/ErrorComponent";
import { useQuery } from "@tanstack/react-query";

type MatchDetailsProps = {
  matchDetailsId: string;
  playerIdIndex?: string;
  lobbyType?: string;
  gameMode?: string;
};
const fontSize = Dimensions.get("screen").width * 0.03;

export const MatchDetailsScreen = ({
  matchDetailsId,
  playerIdIndex,
  lobbyType,
  gameMode,
}: MatchDetailsProps) => {
  const layout = useWindowDimensions();
  const { englishLanguage } = useSettingsStore();

  const setTeamFightsData = useTeamFightsStore((state) => state.setData);
  const colorTheme = useThemeStore((state) => state.colorTheme);

  const [index, setIndex] = useState(0);

  const matchDetailsQuery = useQuery({
    queryKey: ["matchDetails"],
    queryFn: () => getMatchDetails(matchDetailsId),
  });
  const matchDetails = matchDetailsQuery.data;

  const teamFightsMemo = matchDetails?.teamfights ?? [];

  const radName = englishLanguage ? "Radiant" : "Iluminados";
  const direName = englishLanguage ? "Dire" : "Temidos";
  const hasTeamFights = !!matchDetails?.teamfights?.length;

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

  if (matchDetailsQuery.isLoading)
    return (
      <ActivityIndicatorCustom
        message={
          englishLanguage
            ? "Loading Match Details..."
            : "Carregando Detalhes da Partida..."
        }
      />
    );
  if (!matchDetails || matchDetailsQuery.isError)
    return <ErrorComponent action={matchDetailsQuery.refetch} />;

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
};

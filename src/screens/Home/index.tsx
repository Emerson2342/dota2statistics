import React, { useMemo, useState } from "react";
import { View, Dimensions, useWindowDimensions } from "react-native";
import { PRO_MATCHES_URL } from "@src/constants/player";
import { useTheme } from "@src/context/useThemeContext";
import { fetchData, getHeroesStats } from "@src/services/api";
import { LeagueMatches } from "../../../src/services/props";
import { TabBar, TabView } from "react-native-tab-view";
import { ActivityIndicatorCustom } from "@src/utils/ActivityIndicatorCustom";
import { TrendingsTab } from "./TrendingsTab";
import { MyProfileTabs } from "./MyProfileTabs";
import { HeroesPlayedComponent } from "./HeroesPlayedTabs/HeroesPlayedComponent";
import { ErrorComponent } from "@src/utils/ErrorComponent";
import { OrdererLeagueMatches } from "@src/services/ordererLeagueMatches";
import { usePlayerStore } from "@src/store/player";
import { useSettingsStore } from "@src/store/settings";
import { useQuery } from "@tanstack/react-query";

export function Home() {
  const { playerId, heroesPlayed, handleFetchPlayerData, isLoadingContext } =
    usePlayerStore();
  const { ColorTheme } = useTheme();
  const { englishLanguage } = useSettingsStore();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const { proMatchesQuery, heroesStatsQuery } = useHomeData();

  const routes = useMemo(
    () => [
      { key: "trendings", title: englishLanguage ? "Trendings" : "Populares" },
      {
        key: "myProfile",
        title: englishLanguage ? "My Profile" : "Meu Perfil",
      },
      {
        key: "heroesPlayed",
        title: englishLanguage ? "Heroes Played" : "Heróis Jogados",
      },
    ],
    [englishLanguage]
  );

  function useHomeData() {
    const proMatchesQuery = useQuery({
      queryKey: ["proMatches"],
      queryFn: () =>
        fetchData<LeagueMatches[]>(PRO_MATCHES_URL).then((res) =>
          OrdererLeagueMatches(res)
        ),
    });

    const heroesStatsQuery = useQuery({
      queryKey: ["heroesStats"],
      queryFn: () => getHeroesStats(),
    });

    return {
      proMatchesQuery,
      heroesStatsQuery,
    };
  }

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "orange" }}
      activeColor="#fff"
      inactiveColor="#888"
      style={{ backgroundColor: ColorTheme.semidark }}
    />
  );

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "trendings":
        return (
          <TrendingsTab
            color={ColorTheme.light}
            heroesStats={heroesStatsQuery.data ?? []}
            onRefresh={proMatchesQuery.refetch}
            proMatches={proMatchesQuery.data ?? []}
          />
        );
      case "myProfile":
        return <MyProfileTabs index={index} />;
      case "heroesPlayed":
        return (
          <HeroesPlayedComponent
            isLoading={isLoadingContext}
            heroesPlayedList={heroesPlayed}
            isHomeProfile={true}
            refresh={async () => await handleFetchPlayerData(playerId ?? "")}
          />
        );
      default:
        return null;
    }
  };

  if (proMatchesQuery.isLoading || heroesStatsQuery.isLoading)
    return (
      <ActivityIndicatorCustom
        message={englishLanguage ? "Loading..." : "Carregando..."}
      />
    );
  if (proMatchesQuery.isError || heroesStatsQuery.isError)
    return (
      <ErrorComponent
        action={async () => {
          proMatchesQuery.refetch;
          heroesStatsQuery.refetch;
        }}
      />
    );

  return (
    <View style={{ flex: 1 }}>
      <TabView
        key={index}
        lazy={false}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        commonOptions={{
          labelStyle: {
            fontSize: Dimensions.get("screen").width * 0.03,
            fontFamily: "QuickSand-Bold",
            textAlign: "center",
          },
        }}
      />
    </View>
  );
}

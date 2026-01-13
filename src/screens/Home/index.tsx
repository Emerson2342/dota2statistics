import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Dimensions, ViewBase } from "react-native";
import { PRO_MATCHES_URL } from "@src/constants/player";
import { fetchData, getHeroesStats } from "@src/services/api";
import { LeagueMatches } from "@src/services/props";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { ActivityIndicatorCustom } from "@src/components/ActivityIndicatorCustom";
import { TrendingsTab } from "./TrendingsTab";
import { MyProfileTabs } from "./MyProfileTabs";
import { HeroesPlayedComponent } from "./HeroesPlayedTabs/HeroesPlayedComponent";
import { ErrorComponent } from "@src/components/ErrorComponent";
import { OrdererLeagueMatches } from "@src/services/ordererLeagueMatches";
import { usePlayerStore } from "@src/store/player";
import { useSettingsStore } from "@src/store/settings";
import { useQuery } from "@tanstack/react-query";
import { useThemeStore } from "@src/store/theme";
import { WaveTrendings } from "@src/components/Waves";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TextComponent } from "@src/components/TextComponent";

const fontSize = Dimensions.get("screen").width * 0.03;

const initialLayout = {
  width: Dimensions.get("window").width,
};

export function Home() {
  const playerId = usePlayerStore((state) => state.playerId);
  const heroesPlayed = usePlayerStore((state) => state.heroesPlayed);
  const isLoadingContext = usePlayerStore((state) => state.isLoadingContext);
  const hasFetchedInitialData = usePlayerStore(
    (state) => state.hasFetchedInitialData
  );

  const handleFetchPlayerData = usePlayerStore(
    (state) => state.handleFetchPlayerData
  );

  const colorTheme = useThemeStore((state) => state.colorTheme);

  const { englishLanguage } = useSettingsStore();

  const [index, setIndex] = useState(0);
  const { proMatchesQuery, heroesStatsQuery } = useHomeData();

  useEffect(() => {
    if (!playerId) return;
    if (hasFetchedInitialData) return;
    handleFetchPlayerData(playerId);
  }, [playerId, hasFetchedInitialData]);

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
      staleTime: 0,
    });

    const heroesStatsQuery = useQuery({
      queryKey: ["heroesStats"],
      queryFn: () => getHeroesStats(),
      staleTime: 0,
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
      style={{ backgroundColor: colorTheme.semidark }}
    />
  );

  const heroesStats = heroesStatsQuery.data ?? [];
  const proMatches = proMatchesQuery.data ?? [];

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "trendings":
        return (
          <View style={{ flex: 1 }}>
            <TrendingsTab
              color={colorTheme.light}
              heroesStats={heroesStats}
              proMatches={proMatches}
              onRefresh={proMatchesQuery.refetch}
            />
          </View>
        );
      case "myProfile":
        return (
          <View style={{ flex: 1 }}>
            <MyProfileTabs index={index} />
          </View>
        );
      case "heroesPlayed":
        return (
          <View style={{ flex: 1 }}>
            <HeroesPlayedComponent
              isLoading={isLoadingContext}
              heroesPlayedList={heroesPlayed}
              isHomeProfile={true}
            />
          </View>
        );
    }
  };

  if (proMatchesQuery.isLoading || heroesStatsQuery.isLoading)
    return (
      <>
        <WaveTrendings />
        <ActivityIndicatorCustom
          message={englishLanguage ? "Loading..." : "Carregando..."}
        />
      </>
    );
  if (proMatchesQuery.isError || heroesStatsQuery.isError)
    return (
      <ErrorComponent
        action={async () => {
          proMatchesQuery.refetch();
          heroesStatsQuery.refetch();
        }}
      />
    );

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <TabView
        lazy
        lazyPreloadDistance={2}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        commonOptions={{
          labelStyle: {
            fontSize: fontSize > 15 ? 15 : fontSize,
            fontFamily: "QuickSand-Bold",
            textAlign: "center",
          },
        }}
      />
    </SafeAreaProvider>
  );
}

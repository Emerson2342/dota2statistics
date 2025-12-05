import React, { useEffect, useMemo, useState } from "react";
import { View, Dimensions, useWindowDimensions } from "react-native";
import {
  PLAYER_PROFILE_API_BASE_URL,
  PRO_MATCHES_URL,
} from "../../constants/player";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { fetchData, getHeroesPlayed, getHeroesStats } from "../../services/api";
import {
  HeroesPlayed,
  HeroStats,
  LeagueMatches,
} from "../../../src/services/props";
import { TabBar, TabView } from "react-native-tab-view";
import { ActivityIndicatorCustom } from "../../../src/utils/ActivityIndicatorCustom";
import { TrendingsTab } from "./TrendingsTab";
import { MyProfileTabs } from "./MyProfileTabs";
import { HeroesPlayedComponent } from "./HeroesPlayedTabs/HeroesPlayedComponent";
import { ErrorComponent } from "../../../src/utils/ErrorComponent";
import { OrdererLeagueMatches } from "../../../src/services/ordererLeagueMatches";
import { usePlayerContext } from "../../../src/context/usePlayerContex";

export function Home() {
  const { player, heroesPlayed, handleFetchPlayerData, isLoadingContext } =
    usePlayerContext();
  const { ColorTheme } = useTheme();
  const { englishLanguage } = useSettingsContext();
  const layout = useWindowDimensions();

  const [isLoading, setIsLoading] = useState(true);
  const [proMatches, setProMatches] = useState<LeagueMatches[] | []>([]);
  const [heroesStats, setHeroesStats] = useState<HeroStats[] | []>([]);
  const [errorRequest, setErrorRequest] = useState(false);
  const [index, setIndex] = useState(0);

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

  useEffect(() => {
    handleLoadData();
  }, []);

  const handleLoadData = async () => {
    setIsLoading(true);
    setErrorRequest(false);
    try {
      await getProMatches();
      await getHeroesStats(setHeroesStats);
    } catch (error: any) {
      setErrorRequest(true);
    } finally {
      setIsLoading(false);
    }
  };

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
            heroesStats={heroesStats}
            onRefresh={getProMatches}
            proMatches={proMatches}
          />
        );
      case "myProfile":
        return <MyProfileTabs />;
      case "heroesPlayed":
        return (
          <HeroesPlayedComponent
            isLoading={isLoadingContext}
            heroesPlayedList={heroesPlayed}
            isHomeProfile={true}
            refresh={async () =>
              await handleFetchPlayerData(
                player?.profile?.account_id?.toString()
              )
            }
          />
        );
      default:
        return null;
    }
  };

  const getProMatches = async () => {
    await fetchData<LeagueMatches[]>(PRO_MATCHES_URL)
      .then((res) => setProMatches(OrdererLeagueMatches(res)))
      .catch(() => console.error("Error trying to get pro matches"));
  };

  if (isLoading)
    return (
      <ActivityIndicatorCustom
        message={englishLanguage ? "Loading..." : "Carregando..."}
      />
    );
  if (errorRequest) return <ErrorComponent action={handleLoadData} />;

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
      />
    </View>
  );
}

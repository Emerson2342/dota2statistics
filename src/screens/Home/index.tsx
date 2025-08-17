import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Dimensions, Text } from "react-native";
import { createStyles } from "./indexStyles";
import { PLAYER_PROFILE_API_BASE_URL } from "../../constants/player";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useProfileContext } from "../../context/useProfileContext";
import { usePlayerContext } from "../../context/usePlayerContex";
import { useTheme } from "../../context/useThemeContext";
import {
  getHeroesPlayed,
  getHeroesStats,
  getProMatches,
  getRecentMatches,
  getSearchPlayer,
  loadTeamsList,
} from "../../services/api";
import {
  HeroesPlayed,
  HeroStats,
  LeagueMatches,
  RecentMatches,
} from "../../../src/services/props";
import { BannerAds } from "../../components/Admob/BannerAds";
import { TabBar, TabView } from "react-native-tab-view";
import { useTeamsListContext } from "../../context/useTeamContext";
import { ActivityIndicatorCustom } from "../../../src/utils/ActivityIndicatorCustom";
import { TrendingsTab } from "./TrendingsTab";
import { MyProfileTabs } from "./MyProfileTabs";
import { HeroesPlayedComponent } from "./HeroesPlayedTabs/HeroesPlayedComponent";

export function Home() {
  const { profile } = useProfileContext();
  const { ColorTheme } = useTheme();
  const { setPlayer, setHeroesPlayedId } = usePlayerContext();
  const { englishLanguage } = useSettingsContext();
  const { setTeamsList } = useTeamsListContext();

  const [isLoading, setIsLoading] = useState(true);

  const [proMatches, setProMatches] = useState<LeagueMatches[] | []>([]);
  const [heroesStats, setHeroesStats] = useState<HeroStats[] | []>([]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    handleLoadData();
    loadTeamsList(setTeamsList);
  }, [profile]);
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

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "trendings":
        return (
          <TrendingsTab
            color={ColorTheme.light}
            heroesStats={heroesStats}
            onRefresh={handleRefresh}
            proMatches={proMatches}
          />
        );
      case "myProfile":
        return <MyProfileTabs />;
      case "heroesPlayed":
        return <HeroesPlayedComponent PlayerId={profile?.id_Steam ?? "1"} />;
      default:
        return null;
    }
  };
  const handleRefresh = useCallback(async () => {
    await getProMatches(setProMatches);
  }, [getProMatches]);

  const Loading = useMemo(
    () => (
      <View style={{ flex: 1 }}>
        <ActivityIndicatorCustom
          message={englishLanguage ? "Loading..." : "Carregando..."}
        />
        <BannerAds />
      </View>
    ),
    [isLoading]
  );

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

  const handleLoadData = async () => {
    console.log("Carregando********************");
    setIsLoading(true);
    setTimeout(async () => {
      const searchPlayer = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}`;
      await getSearchPlayer(searchPlayer, setPlayer);
      await getProMatches(setProMatches);
      await getHeroesStats(setHeroesStats);

      const recentMatchesUrl = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}/recentMatches`;

      await getRecentMatches(recentMatchesUrl, setHeroesPlayedId);

      setIsLoading(false);
    }, 500);
  };

  if (isLoading) return Loading;

  return (
    <TabView
      style={{ flex: 1 }}
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get("window").width }}
      lazy
      lazyPreloadDistance={0}
      renderLazyPlaceholder={() => (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicatorCustom
            message={englishLanguage ? "Loading..." : "Carregando..."}
          />
        </View>
      )}
      commonOptions={{
        labelStyle: {
          fontSize: Dimensions.get("screen").width * 0.03,
          fontFamily: "QuickSand-Bold",
          textAlign: "center",
        },
      }}
    />
  );
}

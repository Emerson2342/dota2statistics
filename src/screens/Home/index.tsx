import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Dimensions,
} from "react-native";
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
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import { ActivityIndicatorCustom } from "../../../src/utils/ActivityIndicatorCustom";
import { HeroesPlayedTabs } from "./HeroesPlayedTabs";
import { TrendingsTab } from "./TrendingsTab";
import { MyProfileTabs } from "./MyProfileTabs";

const analytics = getAnalytics();

export function Home() {
  const { profile } = useProfileContext();
  const { ColorTheme } = useTheme();
  const { player, setPlayer, heroesPlayedId, setHeroesPlayedId } =
    usePlayerContext();
  const { englishLanguage } = useSettingsContext();
  const { setTeamsList } = useTeamsListContext();

  const [isLoading, setIsLoading] = useState(true);

  const [recentMatches, setRecentMatches] = useState<RecentMatches[] | []>([]);
  const [heroesPlayed, setHeroesPlayed] = useState<HeroesPlayed[] | []>([]);
  const [proMatches, setProMatches] = useState<LeagueMatches[] | []>([]);
  const [heroesStats, setHeroesStats] = useState<HeroStats[] | []>([]);


  const layout = useMemo(() => {
    const { width } = Dimensions.get('window');
    return { width };
  }, []);

  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    logEvent(analytics, 'home_page');
  }, []);

  useEffect(() => {
    handleLoadData();
    loadTeamsList(setTeamsList);
  }, []);


  const renderScene = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case "trendings":
          return renderTrendingsScene();
        case "myProfile":
          return renderMyProfile();
        case "heroesPlayed":
          return renderHeroesPlayed();
        default:
          return null;
      }
    },
    [isLoading]
  );
  const handleRefresh = useCallback(async () => {
    await getProMatches(setProMatches);
  }, [getProMatches]);


  const Loading = useMemo(
    () => (
      <View style={{ flex: 1 }}>
        <ActivityIndicatorCustom message={englishLanguage ? "Loading..." : "Carregando..."} />
        <BannerAds />
      </View>
    ),
    [isLoading]
  );
  function renderHeroesPlayed() {
    return (
      <HeroesPlayedTabs
        heroesPlayedList={heroesPlayed}
      />
    );
  };

  function renderTrendingsScene() {
    return (
      <TrendingsTab
        color={ColorTheme.light}
        heroesStats={heroesStats}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        proMatches={proMatches}
      />
    );
  };

  function renderMyProfile() {
    return (
      <MyProfileTabs />
    );
  };

  const routes = [
    {
      key: "trendings",
      title: englishLanguage ? "Trendings" : "Populares",
    },
    { key: "myProfile", title: englishLanguage ? "My Profile" : "Meu Perfil" },
    {
      key: "heroesPlayed",
      title: englishLanguage ? "Heroes Played" : "Heróis Jogados",
    },
  ];

  const handleLoadData = async () => {
    console.log("Carregando********************");
    setIsLoading(true);
    setTimeout(async () => {
      const searchPlayer = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}`;
      await getSearchPlayer(searchPlayer, setPlayer);
      await getProMatches(setProMatches);
      await getHeroesStats(setHeroesStats);

      const recentMatchesUrl = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}/recentMatches`;

      await getRecentMatches(
        recentMatchesUrl,
        setRecentMatches,
        setHeroesPlayedId
      );

      const heroesPlayed = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}/heroes`;

      const heroesPlayedResponse = await getHeroesPlayed(heroesPlayed);
      if (heroesPlayedResponse && heroesPlayedResponse?.length > 0)
        setHeroesPlayed(heroesPlayedResponse);
      setIsLoading(false);
    }, 500);
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

  if (isLoading) return Loading;

  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy={true}
      renderLazyPlaceholder={() => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicatorCustom message={englishLanguage ? "Loading..." : "Carregando..."} />
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

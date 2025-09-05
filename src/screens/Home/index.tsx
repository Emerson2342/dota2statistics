import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Dimensions, Text } from "react-native";
import { createStyles } from "./indexStyles";
import { PLAYER_PROFILE_API_BASE_URL } from "../../constants/player";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useProfileContext } from "../../context/useProfileContext";
import { usePlayerContext } from "../../context/usePlayerContex";
import { useTheme } from "../../context/useThemeContext";
import {
  getHeroesStats,
  getProMatches,
  getRecentMatches,
  getSearchPlayer,
  loadTeamsList,
} from "../../services/api";
import { HeroStats, LeagueMatches } from "../../../src/services/props";
import { TabBar, TabView } from "react-native-tab-view";
import { useTeamsListContext } from "../../context/useTeamContext";
import { ActivityIndicatorCustom } from "../../../src/utils/ActivityIndicatorCustom";
import { TrendingsTab } from "./TrendingsTab";
import { MyProfileTabs } from "./MyProfileTabs";
import { HeroesPlayedComponent } from "./HeroesPlayedTabs/HeroesPlayedComponent";
import { ErrorComponent } from "../../../src/utils/ErrorComponent";
import { BannerAds } from "../../../src/components/Admob/BannerAds";

export function Home() {
  const { profile } = useProfileContext();
  const { ColorTheme } = useTheme();
  const { setPlayer, setHeroesPlayedId } = usePlayerContext();
  const { englishLanguage } = useSettingsContext();
  const { setTeamsList } = useTeamsListContext();

  const [isLoading, setIsLoading] = useState(true);

  const [proMatches, setProMatches] = useState<LeagueMatches[] | []>([]);
  const [heroesStats, setHeroesStats] = useState<HeroStats[] | []>([]);
  const [errorRequest, setErrorRequest] = useState(false);

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
        return (
          <HeroesPlayedComponent
            PlayerId={profile?.id_Steam ?? "1"}
            isHomeProfile={true}
          />
        );
      default:
        return null;
    }
  };
  const handleRefresh = useCallback(async () => {
    await getProMatches(setProMatches);
  }, [getProMatches]);

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
    setErrorRequest(false);
    setTimeout(async () => {
      try {
        const searchPlayer = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}`;
        await getSearchPlayer(searchPlayer, setPlayer);
        await getProMatches(setProMatches);
        await getHeroesStats(setHeroesStats);

        const recentMatchesUrl = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}/recentMatches`;

        await getRecentMatches(recentMatchesUrl, setHeroesPlayedId);
      } catch (error: any) {
        setErrorRequest(true);
      } finally {
        setIsLoading(false);
      }
    }, 500);
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
    </View>
  );
}

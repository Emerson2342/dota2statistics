import React, { useEffect, useMemo, useState } from "react";
import { View, Dimensions } from "react-native";
import {
  PRO_MATCHES_URL,
} from "../../constants/player";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import {
  fetchData,
  getHeroesStats,
} from "../../services/api";
import { HeroStats, LeagueMatches } from "../../../src/services/props";
import { TabBar, TabView } from "react-native-tab-view";
import { ActivityIndicatorCustom } from "../../../src/utils/ActivityIndicatorCustom";
import { TrendingsTab } from "./TrendingsTab";
import { MyProfileTabs } from "./MyProfileTabs";
import { HeroesPlayedComponent } from "./HeroesPlayedTabs/HeroesPlayedComponent";
import { ErrorComponent } from "../../../src/utils/ErrorComponent";
import { OrdererLeagueMatches } from "../../../src/services/ordererLeagueMatches";

export function Home() {
  const { ColorTheme } = useTheme();
  const { englishLanguage } = useSettingsContext();

  const [isLoading, setIsLoading] = useState(true);

  const [proMatches, setProMatches] = useState<LeagueMatches[] | []>([]);
  const [heroesStats, setHeroesStats] = useState<HeroStats[] | []>([]);
  const [errorRequest, setErrorRequest] = useState(false);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    handleLoadData();
  }, []);
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
            onRefresh={getProMatches}
            proMatches={proMatches}
          />
        );
      case "myProfile":
        return <MyProfileTabs />;
      case "heroesPlayed":
        return (
          <HeroesPlayedComponent
            isHomeProfile={true}
          />
        );
      default:
        return null;
    }
  };
  // const handleRefresh = useCallback(async () => {
  //   await getProMatches(setProMatches);
  // }, [getProMatches]);

  const getProMatches = async () => {
    await fetchData<LeagueMatches[]>(PRO_MATCHES_URL)
      .then((res) => {
        const matches = OrdererLeagueMatches(res);
        setProMatches(matches);
      })
      .catch(() => console.error("Error trying to get pro matches"));
  };

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
        await getProMatches();
        await getHeroesStats(setHeroesStats);
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

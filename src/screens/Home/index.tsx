import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  useWindowDimensions,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import { createStyles } from "./indexStyles";
import { PLAYER_PROFILE_API_BASE_URL } from "../../constants/player";
import { useSettingsContext } from "../../context/useSettingsContext";
import { ProfileHeader } from "./MyProfileTabs/ProfileHeader";
import { useProfileContext } from "../../context/useProfileContext";
import { usePlayerContext } from "../../context/usePlayerContex";
import { ProMatches } from "./TrendingsTab/ProMatches";
import { useTheme } from "../../context/useThemeContext";
import {
  getHeroesPlayed,
  getHeroesStats,
  getProMatches,
  getRecentMatches,
  getSearchPlayer,
  loadTeamsList,
} from "../../services/api";
import { LastMatches } from "./MyProfileTabs/LastMatches";
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
import { Searchbar } from "react-native-paper";

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
  const erro404 = englishLanguage
    ? "Please, make sure the Steam Id is correct and the profile is set to public!"
    : "Por favor, certifique-se de que o Id da Steam esteja correto e que o perfil esteja com visibilidade para o público!";

  const styles = createStyles(ColorTheme);

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    logEvent(analytics, 'home_page');
  }, []);

  useEffect(() => {
    handleLoadData();
    loadTeamsList(setTeamsList);
  }, [profile]);

  const SetSteamId = () => {

    const [text, setText] = useState("");
    return (
      <View style={styles.inputContainer}>
        <Searchbar
          style={styles.textInput}
          placeholder={englishLanguage ? "Search" : "Buscar"}
          value={text}
          onChangeText={(textInput) => setText(textInput)}
          elevation={3}
          iconColor={ColorTheme.semidark}
          placeholderTextColor={ColorTheme.semilight}
        //onIconPress={() => handleSearch(inputText)}
        />
        <Text style={styles.textErro}>{erro404}</Text>

      </View>
    );
  };

  const renderScene = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case "trendings":
          return <Trendings />;
        case "myProfile":
          return <MyProfile />;
        case "heroesPlayed":
          return <HeroesPlayed />;
        default:
          return null;
      }
    },
    [
      profile,
      recentMatches,
      proMatches,
      heroesPlayed,
      heroesPlayedId,
      isLoading,
    ]
  );

  const Loading = useMemo(
    () => (
      <View style={{ flex: 1 }}>
        <ActivityIndicatorCustom message={englishLanguage ? "Loading..." : "Carregando..."} />
        <BannerAds />
      </View>
    ),
    [isLoading]
  );
  const HeroesPlayed = React.memo(() => {
    return (
      <HeroesPlayedTabs
        heroesPlayedList={heroesPlayed}
        successPlayerAccount={player == null || player.profile.account_id == 0 ? false : true}
        setSteamIdComponent={SetSteamId}
      />
    );
  });
  const handleRefresh = useCallback(async () => {
    await getProMatches(setProMatches);
  }, [getProMatches]);

  const Trendings = React.memo(() => {
    return (
      <TrendingsTab
        color={ColorTheme.light}
        heroesStats={heroesStats}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        proMatches={proMatches}
      />
    );
  });

  const MyProfile = React.memo(() => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          {player == null || player.profile.account_id == 0 ? (
            <SetSteamId />
          ) : (
            <>
              <View
                style={{
                  flex: heroesPlayedId.length > 5 ? 0.3 : 0.28,
                  marginTop: "1%",
                }}
              >
                <ProfileHeader
                  player={player}
                  heroesId={heroesPlayedId}
                  recentMatches={recentMatches}
                />
              </View>
              <View style={{ flex: heroesPlayedId.length > 5 ? 0.7 : 0.72 }}>
                <View style={{ flex: 1, paddingBottom: "1%" }}>
                  {player ? (
                    <LastMatches
                      playerId={player.profile.account_id.toString()}
                      onRefresh={() => handleLoadData()}
                      recentMatches={recentMatches}
                    />
                  ) : null}
                </View>
              </View>
            </>
          )}
        </View>
        <BannerAds />
      </View>
    );
  });

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
      renderLazyPlaceholder={() => Loading}
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

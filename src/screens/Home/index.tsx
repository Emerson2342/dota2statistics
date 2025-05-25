import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { createStyles } from "./indexStyles";
import { PLAYER_PROFILE_API_BASE_URL } from "../../constants/player";
import { useSettingsContext } from "../../context/useSettingsContext";
import { ProfileHeader } from "./ProfileHeader";
import { useProfileContext } from "../../context/useProfileContext";
import { usePlayerContext } from "../../context/usePlayerContex";
import { ProMatches } from "./ProMatches";
import { useTheme } from "../../context/useThemeContext";
import {
  getHeroesPlayed,
  getHeroesStats,
  getProMatches,
  getRecentMatches,
  getSearchPlayer,
  loadTeamsList,
} from "../../services/api";
import { LastMatches } from "./LastMatches";
import {
  HeroesPlayed,
  HeroStats,
  LeagueMatches,
  RecentMatches,
} from "../../../src/services/props";
import { BannerAds } from "../../components/Admob/BannerAds";
import { TabBar, TabView } from "react-native-tab-view";
import { HeroesPlayedComponent } from "./HeroesPlayedComponent";
import { HeroesStats } from "./HeroesStats";
import { useTeamsListContext } from "../../context/useTeamContext";
import { useTimestampContext } from "../../context/useTimestampContext";

export function Profile() {
  const { profile } = useProfileContext();
  const { ColorTheme } = useTheme();
  const { player, setPlayer, heroesPlayedId, setHeroesPlayedId } =
    usePlayerContext();
  const { englishLanguage } = useSettingsContext();
  const { leagueTimestamp, setLeagueTimestamp } = useTimestampContext();
  const { setTeamsList } = useTeamsListContext();

  const [isLoading, setIsLoading] = useState(true);

  const [recentMatches, setRecentMatches] = useState<RecentMatches[] | []>([]);
  const [heroesPlayed, setHeroesPlayed] = useState<HeroesPlayed[] | []>([]);
  const [proMatches, setProMatches] = useState<LeagueMatches[] | []>([]);
  const [heroesStats, setHeroesStats] = useState<HeroStats[] | []>([]);

  const styles = createStyles(ColorTheme);

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const currentTimestamp = Math.floor(Date.now() / 1000);

  useEffect(() => {
    handleLoadData();
    if (leagueTimestamp == null || leagueTimestamp + 86000 < currentTimestamp) {
      loadTeamsList(setTeamsList);
      setLeagueTimestamp(currentTimestamp);
    }
  }, [profile]);

  const renderScene = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case "myProfile":
          return <MyProfile />;
        case "heroesPlayed":
          return <HeroesPlayed />;
        case "trendings":
          return <Trendings />;
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
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <ActivityIndicator color={ColorTheme.dark} />
        <Text style={styles.textLoading}>
          {englishLanguage ? "Loading..." : "Carregando..."}
        </Text>
      </View>
    ),
    [isLoading]
  );
  const HeroesPlayed = React.memo(() => {
    return (
      <HeroesPlayedComponent
        HeroesPlayedList={heroesPlayed}
        successPlayerAccount={
          player == null || player.profile.account_id == 0 ? false : true
        }
        textError={erro404}
      />
    );
  });

  const Trendings = React.memo(() => {
    return (
      <View style={{ flex: 1, backgroundColor: ColorTheme.light }}>
        <View style={{ flex: 0.3 }}>
          <HeroesStats heroesStats={heroesStats} />
        </View>
        <View style={{ flex: 0.7 }}>
          <ProMatches
            onRefresh={async () => await getProMatches(setProMatches)}
            proMatches={proMatches}
          />
        </View>
        <BannerAds />
      </View>
    );
  });

  const MyProfile = React.memo(() => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          {player == null || player.profile.account_id == 0 ? (
            <View style={styles.erroMessage}>
              <Text style={styles.textErro}>{erro404}</Text>
            </View>
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
    { key: "myProfile", title: englishLanguage ? "My Profile" : "Meu Perfil" },
    {
      key: "heroesPlayed",
      title: englishLanguage ? "Heroes Played" : "Heróis Jogados",
    },
    {
      key: "trendings",
      title: englishLanguage ? "Trendings" : "Populares",
    },
  ];
  const erro404 = englishLanguage
    ? "Please, make sure the Steam Id is correct and the profile is set to public!"
    : "Por favor, certifique-se de que o Id da Steam esteja correto e que o perfil esteja com visibilidade para o público!";

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

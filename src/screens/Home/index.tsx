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

export function Profile() {
  const { profile } = useProfileContext();
  const { ColorTheme } = useTheme();
  const { player, setPlayer, heroesPlayedId, setHeroesPlayedId } =
    usePlayerContext();
  const { englishLanguage } = useSettingsContext();

  const [isLoading, setIsLoading] = useState(true);

  const [recentMatches, setRecentMatches] = useState<RecentMatches[] | []>([]);
  const [heroesPlayed, setHeroesPlayed] = useState<HeroesPlayed[] | []>([]);
  const [proMatches, setProMatches] = useState<LeagueMatches[] | []>([]);
  const [heroesStats, setHeroesStats] = useState<HeroStats[] | []>([]);
  const [successPlayerAccount, setSuccessPlayerAccount] = useState(false);

  const styles = createStyles(ColorTheme);

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const renderScene = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case "first":
          return <Home />;
        case "heroesPlayed":
          return <HeroesPlayed />;
        case "second":
          return (
            <ProMatches
              onRefresh={async () => await getProMatches(setProMatches)}
              proMatches={proMatches}
            />
          );
        default:
          return null;
      }
    },
    [
      profile,
      recentMatches,
      heroesPlayed,
      heroesPlayedId,
      isLoading,
      successPlayerAccount,
    ]
  );

  const Loading = useMemo(() => {
    return (
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
    );
  }, [isLoading]);

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

  const Home = React.memo(() => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, marginBottom: 15 }}>
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
              <View style={{ flex: heroesPlayedId.length > 5 ? 0.45 : 0.47 }}>
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

          <View style={{ flex: 0.25 }}>
            <HeroesStats heroesStats={heroesStats} />
          </View>
        </View>
        <BannerAds />
      </View>
    );
  });

  const routes = [
    { key: "first", title: englishLanguage ? "Home" : "Início" },
    {
      key: "heroesPlayed",
      title: englishLanguage ? "Heroes Played" : "Heróis Jogados",
    },
    {
      key: "second",
      title: englishLanguage ? "Pro Matches" : "Partidas Profissionais",
    },
  ];
  const erro404 = englishLanguage
    ? "Please, make sure the Steam Id is correct and the profile is set to public!"
    : "Por favor, certifique-se de que o Id da Steam esteja correto e que o perfil esteja com visibilidade para o público!";

  const handleLoadData = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      console.log("Entrou");
      const searchPlayer = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}`;
      console.log("Carregando********************");
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

      console.log(
        "Tamanho da lista de heroes: " + heroesPlayedResponse?.length
      );
      console.log("Tamanho da lista do: " + heroesPlayedResponse?.length);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    handleLoadData();
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

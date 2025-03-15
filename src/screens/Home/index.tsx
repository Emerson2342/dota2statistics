import React, { useCallback, useEffect, useState } from "react";
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
  getProMatches,
  getRecentMatches,
  getSearchPlayer,
} from "../../../src/API";
import { LastMatches } from "./LastMatches";
import { HeroesPlayed, RecentMatches } from "../../../src/services/props";
import { BannerAds } from "../../../src/components/BannerAds";
import { TabBar, TabView } from "react-native-tab-view";
import { HeroesPlayedComponent } from "./HeroesPlayedComponent";

export function Profile() {
  const { profile } = useProfileContext();
  const { ColorTheme } = useTheme();
  const {
    player,
    setPlayer,
    heroesPlayedId,
    setHeroesPlayedId,
    setProMatches,
  } = usePlayerContext();
  const { englishLanguage } = useSettingsContext();

  const [isLoading, setIsLoading] = useState(true);


  const [recentMatches, setRecentMatches] = useState<RecentMatches[] | []>([]);
  const [heroesPlayed, setHeroesPlayed] = useState<HeroesPlayed[] | []>([]);

  const styles = createStyles(ColorTheme);

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const renderScene = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case "first":
          return isLoading ? <Header /> : <Loading />;
        case "heroesPlayed":
          return isLoading ? <HeroesPlayed /> : <Loading />;
        case "second":
          return isLoading ? <ProMatches /> : <Loading />;
        default:
          return null;
      }
    },
    [profile, recentMatches, heroesPlayed, heroesPlayedId]
  );

  const Loading = React.memo(() => {
    return (<View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 0.82,
      }}
    >
      <ActivityIndicator color={ColorTheme.dark} />
      <Text style={styles.textLoading}>
        {englishLanguage ? "Loading..." : "Carregando..."}
      </Text>
    </View>)
  })

  const HeroesPlayed = React.memo(() => {
    return (<HeroesPlayedComponent HeroesPlayedList={heroesPlayed} />)
  })

  const Header = React.memo(() => {
    return (
      <View style={styles.container}>
        {player == null || player.profile.account_id == 0 ? <View style={styles.erroMessage}>
          <Text style={styles.textErro}>
            {erro404}
          </Text>
        </View> :
          <View style={{ flex: 1 }}>
            <View style={{ flex: 0.25 }}>
              <ProfileHeader
                player={player}
                heroesId={heroesPlayedId}
                recentMatches={recentMatches}
              />
            </View>
            <View style={{ flex: 0.75 }}>
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
          </View>
        }
      </View>
    );
  });

  const routes = [
    { key: "first", title: englishLanguage ? "Overview" : "Resumo" },
    { key: "heroesPlayed", title: englishLanguage ? "Heroes Played" : "Heróis Jogados" },
    {
      key: "second",
      title: englishLanguage ? "Pro Matches" : "Partidas Profissionais",
    },
  ];
  const erro404 = englishLanguage
    ? "Please, make sure the Steam Id is correct and the profile is set to public!"
    : "Por favor, certifique-se de que o Id da Steam esteja correto e que o perfil esteja com visibilidade para o público!";

  const erro500 = englishLanguage
    ? "Internal server error. Please, try again later"
    : "Erro interno no servidor. Por favor, tente mais tarde";

  const handleLoadData = async () => {
    setIsLoading(true);

    setTimeout(async () => {
      await getProMatches(setProMatches);
      const searchPlayer = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}`;
      await getSearchPlayer(searchPlayer, setPlayer);

      const recentMatchesUrl = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}/recentMatches`;

      await getRecentMatches(
        recentMatchesUrl,
        setRecentMatches,
        setHeroesPlayedId
      );

      const heroesPlayed = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}/heroes`;

      const heroesPlayedResponse = await getHeroesPlayed(heroesPlayed);
      if (heroesPlayedResponse && heroesPlayedResponse?.length > 0) setHeroesPlayed(heroesPlayedResponse);

      console.log("Tamanho da lista de heroes: " + heroesPlayedResponse?.length);
      console.log("Tamanho da lista do: " + heroesPlayedResponse?.length);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    console.log("******************************");
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
  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy={true}
      commonOptions={{
        labelStyle: {
          fontSize: Dimensions.get("screen").width * 0.037,
          fontFamily: "QuickSand-Bold",
          textAlign: "center"
        },
      }}
    />
  );


}

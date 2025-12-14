import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Modal,
  useWindowDimensions,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { createStyles } from "./styles";
import {
  fetchData,
  getHeroesPlayed,
  getRecentMatches,
} from "@src/services/api";
import { PLAYER_PROFILE_API_BASE_URL } from "@src/constants/player";
import { PlayerModel, RecentMatches, HeroesPlayed } from "@src/services/props";
import { FontAwesome } from "@expo/vector-icons";
import { ModalRemoveFavoritePlayer } from "@src/components/Modals/ModalRemoveFavoritePlayer";
import { TabBar, TabView } from "react-native-tab-view";
import { ProfileHeader } from "@src/screens/Home/MyProfileTabs/ProfileHeader";
import { LastMatches } from "@src/screens/Home/MyProfileTabs/LastMatches";
import { useNavigation } from "expo-router";
import { ActivityIndicatorCustom } from "@src/components/ActivityIndicatorCustom";
import { SetPlayerModel } from "@src/utils/setPlayer";
import { HeroesPlayedComponent } from "../Home/HeroesPlayedTabs/HeroesPlayedComponent";
import { TextComponent } from "@src/components/TextComponent";
import { useFavoritePlayersStore } from "@src/store/favorites";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";
import { LinearGradient } from "expo-linear-gradient";

export default function PlayerProfileScreen({
  playerId,
}: {
  playerId: string;
}) {
  const navigation = useNavigation();
  const { englishLanguage } = useSettingsStore();
  const { addFavoritePlayer, removeFavoritePlayer, favoritePlayers } =
    useFavoritePlayersStore();

  const colorTheme = useThemeStore((state) => state.colorTheme);

  const styles = createStyles(colorTheme);
  const [player, setPlayer] = useState<PlayerModel | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecentMatches[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroesPlayedId, setHeroesPlayedId] = useState<number[] | []>([]);
  const [modalFavoritesVisible, setModalFavoritesVisible] = useState(false);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [heroesPlayed, setHeroesPlayed] = useState<HeroesPlayed[] | []>([]);
  const [playerIdToRemove, setPlayerIdToRemove] = useState(0);

  const erro404 = englishLanguage
    ? "Unable to access player data. The profile may be set to private."
    : "Não foi possível acessar os dados do jogador. Perfil pode estar como privado.";

  const modalMessageRemove = englishLanguage
    ? "Do you wish remove this player from the favorite list?"
    : "Você deseja remover este jogador da lista de favoritos?";

  const playerFound = favoritePlayers.find(
    (p) => p.profile.account_id.toString() === playerId
  );

  useEffect(() => {
    handleSearch();
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleFavorites}>
          <FontAwesome
            name={playerFound ? "star" : "star-o"}
            size={28}
            color={playerFound ? "orange" : "#fff"}
          />
        </TouchableOpacity>
      ),
    });
  }, [playerFound, player]);

  const handleFavorites = () => {
    if (playerFound) {
      setPlayerIdToRemove(playerFound.profile.account_id);
      setModalFavoritesVisible(true);
      return;
    }
    if (player) {
      addFavoritePlayer(player);
    }
  };

  const routes = [
    { key: "first", title: englishLanguage ? "Overview" : "Resumo" },
    {
      key: "heroesPlayed",
      title: englishLanguage ? "Heroes Played" : "Heróis Jogados",
    },
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    const searchPlayer = `${PLAYER_PROFILE_API_BASE_URL}${playerId}`;
    const recentMatchesUrl = `${PLAYER_PROFILE_API_BASE_URL}${playerId}/recentMatches`;

    await fetchData<PlayerModel>(searchPlayer)
      .then(async (res) => {
        const playerResult = SetPlayerModel(res);
        setPlayer(playerResult);
        const url = `${PLAYER_PROFILE_API_BASE_URL}${playerId}/heroes`;
        const heroesPlayedResponse = await getHeroesPlayed(url);
        if (heroesPlayedResponse && heroesPlayedResponse?.length > 0) {
          const heroesResp = heroesPlayedResponse.filter(
            (item) => item.games > 0
          );
          setHeroesPlayed(heroesResp);
        }
        const { heroesPlayedIdFetch, recentMatchesFetch } =
          await getRecentMatches(recentMatchesUrl);
        setHeroesPlayedId(heroesPlayedIdFetch);
        setRecentMatches(recentMatchesFetch);
      })
      .catch((error) =>
        console.error(
          englishLanguage
            ? "Erro trying to get data"
            : "Erro ao tentar buscar os dados"
        )
      );

    setIsLoading(false);
  };

  const Header = useMemo(() => {
    return (
      <View style={styles.container}>
        {Number(playerId) == 0 ? (
          <View style={styles.erroMessage}>
            <TextComponent weight="bold" style={styles.textErro}>
              {erro404}
            </TextComponent>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <LinearGradient
              // Background Linear Gradient
              colors={["rgba(0,0,0,0.8)", "transparent"]}
              style={styles.background}
            />
            <View style={{ flex: heroesPlayedId.length > 5 ? 0.3 : 0.25 }}>
              <ProfileHeader
                player={player}
                heroesId={heroesPlayedId}
                recentMatches={recentMatches}
              />
            </View>
            <View style={{ flex: heroesPlayedId.length > 5 ? 0.7 : 0.75 }}>
              <View style={{ flex: 1, paddingBottom: "1%" }}>
                {player ? (
                  <LastMatches
                    playerId={playerId}
                    onRefresh={() => handleSearch()}
                    recentMatches={recentMatches}
                  />
                ) : null}
              </View>
            </View>

            <Modal
              visible={modalFavoritesVisible}
              animationType="fade"
              statusBarTranslucent={true}
              transparent={true}
            >
              <ModalRemoveFavoritePlayer
                handleClose={() => setModalFavoritesVisible(false)}
                message={modalMessageRemove}
                removePlayer={() => removeFavoritePlayer(playerIdToRemove)}
              />
            </Modal>
          </View>
        )}
      </View>
    );
  }, [player, heroesPlayedId, recentMatches, modalFavoritesVisible]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: "orange",
      }}
      activeColor={"#fff"}
      inactiveColor={"#888"}
      style={{
        backgroundColor: colorTheme.semidark,
      }}
    />
  );

  const renderScene = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case "first":
          return Header;
        case "heroesPlayed":
          return (
            <HeroesPlayedComponent
              heroesPlayedList={heroesPlayed}
              isHomeProfile={false}
              isLoading={isLoading}
            />
          );
        default:
          return null;
      }
    },
    [modalFavoritesVisible, Header, playerId]
  );

  if (isLoading)
    return (
      <ActivityIndicatorCustom
        message={
          englishLanguage
            ? "Loading Player Details..."
            : "Carregando Dados do Jogador..."
        }
      />
    );

  if (recentMatches.length === 0 && !isLoading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <TextComponent weight="bold" style={styles.textMessage}>
          {erro404}
        </TextComponent>
      </View>
    );

  return (
    <TabView
      lazy
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      //renderLazyPlaceholder={() => Loading}
      commonOptions={{
        labelStyle: {
          fontSize: Dimensions.get("screen").width * 0.037,
          fontFamily: "QuickSand-Bold",
          textAlign: "center",
        },
      }}
    />
  );

  {
    /* <Stack.Screen
        name="player-profile"
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => handleFavorites()}
              style={{ alignItems: "center" }}
            >
              <FontAwesome
                name={playerFound ? "star" : "star-o"}
                color={playerFound ? "orange" : "#fff"}
                size={30}
              />
            </TouchableOpacity>
          ),
        }}
      /> */
  }
}

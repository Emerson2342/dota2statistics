import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Modal,
  useWindowDimensions,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { createStyles } from "./styles";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import {
  getHeroesPlayed,
  getRecentMatches,
  getSearchPlayer,
} from "../../services/api";
import { PLAYER_PROFILE_API_BASE_URL } from "../../constants/player";
import {
  PlayerModel,
  PlayerProfileProps,
  RecentMatches,
  HeroesPlayed,
} from "../../services/props";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { useFavoritesPlayersContext } from "../../context/useFavoritesContext";
import { ModalRemoveFavoritePlayer } from "../../components/Modals/ModalRemoveFavoritePlayer";
import { TabBar, TabView } from "react-native-tab-view";
import { BannerAds } from "../../components/Admob/BannerAds";
import { HeroesPlayedTabs } from "../../screens/Home/HeroesPlayedTabs";
import { ProfileHeader } from "../../screens/Home/MyProfileTabs/ProfileHeader";
import { LastMatches } from "../../screens/Home/MyProfileTabs/LastMatches";

export default function PlayerProfileScreen({
  playerId,
}: {
  playerId: string;
}) {
  const navigation = useNavigation();

  const { englishLanguage } = useSettingsContext();
  const { addFavoritePlayer, removeFavoritePlayer, favoritesPlayers } =
    useFavoritesPlayersContext();

  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);
  const [player, setPlayer] = useState<PlayerModel | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecentMatches[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroesPlayedId, setHeroesPlayedId] = useState<number[] | []>([]);
  const [modalFavoritesVisible, setModalFavoritesVisible] = useState(false);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [heroesPlayed, setHeroesPlayed] = useState<HeroesPlayed[] | []>([]);
  const [playerIdToRemove, setPlayerIdToRemove] = useState(0);
  const [refresh, setRefresh] = useState(true);

  const erro404 = englishLanguage
    ? "Unable to access player data. The profile may be set to private."
    : "Não foi possível acessar os dados do jogador. Perfil pode estar como privado.";

  const modalMessageRemove = englishLanguage
    ? "Do you wish remove this player from the favorite list?"
    : "Você deseja remover este jogador da lista de favoritos?";

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    const playerFound = favoritesPlayers.find(
      (p) => p.profile.account_id.toString() === playerId
    );

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
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={{ width: "50%" }}>
            <TouchableOpacity
              onPress={() => handleFavorites()}
              style={{ width: "100%", marginRight: 15, alignItems: "center" }}
            >
              <FontAwesome
                name={playerFound ? "star" : "star-o"}
                color={playerFound ? "orange" : "#fff"}
                size={30}
              />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [favoritesPlayers, player]);

  const routes = [
    { key: "first", title: englishLanguage ? "Overview" : "Resumo" },
    {
      key: "heroesPlayed",
      title: englishLanguage ? "Heroes Played" : "Heróis Jogados",
    },
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      console.log("*******************************");
      console.log("entrou na busca do jogador: id " + playerId);

      const searchPlayer = `${PLAYER_PROFILE_API_BASE_URL}${playerId}`;
      const recentMatchesUrl = `${PLAYER_PROFILE_API_BASE_URL}${playerId}/recentMatches`;
      await getSearchPlayer(searchPlayer, setPlayer);

      const heroesPlayed = `${PLAYER_PROFILE_API_BASE_URL}${playerId}/heroes`;

      const heroesPlayedResponse = await getHeroesPlayed(heroesPlayed);
      if (heroesPlayedResponse && heroesPlayedResponse?.length > 0)
        setHeroesPlayed(heroesPlayedResponse);

      console.log(
        "Tamanho da lista de heroes: " + heroesPlayedResponse?.length
      );
      console.log("Tamanho da lista do: " + heroesPlayedResponse?.length);

      await getRecentMatches(
        recentMatchesUrl,
        setHeroesPlayedId,
        setRecentMatches
      );

      setIsLoading(false);
      setRefresh(false);
    }, 500);
  };

  const Loading = useMemo(() => {
    return (
      <View
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
      </View>
    );
  }, [refresh]);

  const Header = React.memo(() => {
    return (
      <View style={styles.container}>
        {Number(playerId) == 0 ? (
          <View style={styles.erroMessage}>
            <Text style={styles.textErro}>{erro404}</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
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
        <BannerAds />
      </View>
    );
  });

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

  const renderScene = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case "first":
          return <Header />;
        case "heroesPlayed":
          return (
            <HeroesPlayedTabs PlayerId={playerId} IsPlayerProfile={false} />
          );
        default:
          return null;
      }
    },
    [modalFavoritesVisible, isLoading]
  );

  if (isLoading) return Loading;

  if (recentMatches.length === 0 && !isLoading)
    return <Text style={styles.textMessage}>{erro404}</Text>;
  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderLazyPlaceholder={() => Loading}
      lazy={true}
      commonOptions={{
        labelStyle: {
          fontSize: Dimensions.get("screen").width * 0.037,
          fontFamily: "QuickSand-Bold",
          textAlign: "center",
        },
      }}
    />
  );
}

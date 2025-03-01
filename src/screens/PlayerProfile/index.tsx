import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Modal } from "react-native";

import { createStyles } from "./styles";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { getRecentMatches, getSearchPlayer } from "../../API";
import { PLAYER_PROFILE_API_BASE_URL } from "../../constants/player";
import {
  PlayerModel,
  PlayerProfileProps,
  RecentMatches,
} from "../../services/props";
import { ProfileHeader } from "../Home/ProfileHeader";
import { LastMatches } from "../Home/LastMatches";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { useFavoritesPlayersContext } from "../../../src/context/useFavoritesContext";
import { ModalRemoveFavoritePlayer } from "../../../src/components/Modals/ModalRemoveFavoritePlayer";

export const PlayerProfile = ({ route }: PlayerProfileProps) => {
  const { PlayerId } = route.params;

  const navigation = useNavigation();

  const { englishLanguage } = useSettingsContext();
  const { addFavoritePlayer, removeFavoritePlayer, favoritesPlayers } =
    useFavoritesPlayersContext();

  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);
  const [player, setPlayer] = useState<PlayerModel | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecentMatches[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [heroesPlayedId, setHeroesPlayedId] = useState<number[] | []>([]);
  const [modalFavoritesVisible, setModalFavoritesVisible] = useState(false);

  const erro404 = englishLanguage
    ? "Unable to access player data. The profile may be set to private."
    : "Não foi possível acessar os dados do jogador. Perfil pode estar como privado.";

  const erro500 = englishLanguage
    ? "Internal server error. Please, try again later"
    : "Erro interno no servidor. Por favor, tente mais tarde";

  const [status, setStatus] = useState<number>();

  const modalMessageRemove = englishLanguage
    ? "Do you wish remove this player from the favorite list?"
    : "Você deseja remover este jogador da lista de favoritos?";

  useEffect(() => {
    if (PlayerId) {
      handleSearch();
    }
  }, []);

  const playerFound = favoritesPlayers.find(
    (p) => p.profile.account_id.toString() === PlayerId
  );

  const handleFavorites = () => {
    if (playerFound) {
      setModalFavoritesVisible(true);
      return;
    }
    if (player) {
      addFavoritePlayer(player);
    }
  };

  useEffect(() => {
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

  const handleSearch = async () => {
    console.log("entrou na busca do jogador: id " + PlayerId);
    setIsLoading(true);

    const searchPlayer = `${PLAYER_PROFILE_API_BASE_URL}${PlayerId}`;
    const recentMatchesUrl = `${PLAYER_PROFILE_API_BASE_URL}${PlayerId}/recentMatches`;
    await getSearchPlayer(searchPlayer, setPlayer);
    // const result = ;
    setStatus(
      await getRecentMatches(
        recentMatchesUrl,
        setRecentMatches,
        setHeroesPlayedId
      )
    );
    setIsLoading(false);
  };

  if (recentMatches.length === 0 && !isLoading)
    return <Text style={styles.textMessage}>{erro404}</Text>;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          style={{ flex: 0.9 }}
          color={ColorTheme.semidark}
          size={30}
        />
      ) : (
        <View style={styles.bodyContainer}>
          {player && player.profile.account_id != 0 ? (
            <>
              <View style={{ flex: heroesPlayedId.length > 10 ? 0.4 : 0.37 }}>
                <ProfileHeader
                  player={player}
                  heroesId={heroesPlayedId}
                  recentMatches={recentMatches}
                />
              </View>
              <View style={{ flex: heroesPlayedId.length > 10 ? 0.6 : 0.63 }}>
                <LastMatches
                  playerId={PlayerId}
                  recentMatches={recentMatches}
                  onRefresh={() => Promise<void>}
                />
              </View>
            </>
          ) : (
            <Text style={styles.textMessage}>{erro404}</Text>
          )}
        </View>
      )}
      <Modal
        visible={modalFavoritesVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        {player ? (
          <ModalRemoveFavoritePlayer
            message={modalMessageRemove}
            removePlayer={() => removeFavoritePlayer(player.profile.account_id)}
            handleClose={() => setModalFavoritesVisible(false)}
          />
        ) : (
          <></>
        )}
      </Modal>
    </View>
  );
};

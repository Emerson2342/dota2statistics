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
import { ModalFavoritePlayers } from "../../../src/components/Modals/ModalFavoritePlayer";

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
    const [isAddingPlayer, setIsAddindPlayer] = useState(true);

    const erro404 = englishLanguage
        ? "Please, make sure the Steam Id is correct and the profile is set to public!"
        : "Por favor, certifique-se de que o Id da Steam esteja correto e que o perfil esteja com visibilidade para o público!";

    const erro500 = englishLanguage
        ? "Internal server error. Please, try again later"
        : "Erro interno no servidor. Por favor, tente mais tarde";

    const [status, setStatus] = useState<number>();

    const modalMessageAdd = englishLanguage
        ? "Do you wish add this player in the favorite list?"
        : "Deseja adicionar este jogado na lista de favoritos?";

    const modalMessageRemove = englishLanguage
        ? "Do you wish remove this player from the favorite list?"
        : "Vocë deseja remover este jogador da lista de favoritos?";



    useEffect(() => {
        if (PlayerId) {
            handleSearch();
        }
    }, []);



    useEffect(() => {
        const playerFound = favoritesPlayers.find(
            (p) => p.profile.account_id.toString() == PlayerId
        );
        if (playerFound) {
            setIsAddindPlayer(false);

        } else {
            setIsAddindPlayer(true);
        }
        console.log("Lista de Jogadores Favoritos:" + JSON.stringify(favoritesPlayers, null, 2))
        navigation.setOptions({
            headerRight: () => {
                return (
                    <View style={{ width: "50%" }}>
                        <TouchableOpacity
                            onPress={() => setModalFavoritesVisible(true)}
                            style={{ width: "100%", marginRight: 15, alignItems: "center" }}
                        >
                            <FontAwesome
                                name={playerFound ? "star" : "star-o"}
                                color={"orange"}
                                size={30}
                            />
                        </TouchableOpacity>
                    </View>
                );
            },
        });
    }, [favoritesPlayers])

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
                    <ModalFavoritePlayers
                        addAction={isAddingPlayer}
                        message={isAddingPlayer ? modalMessageAdd : modalMessageRemove}
                        addPlayer={() => addFavoritePlayer(player)}
                        removePlayer={() => removeFavoritePlayer(player.profile.account_id)}
                        handleClose={() => setModalFavoritesVisible(false)}
                    />
                ) : <></>}
            </Modal>
        </View>
    );
};

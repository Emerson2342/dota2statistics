import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";

import { createStyles } from "./styles";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { PlayerModel } from "../../../src/services/props";
import { Medal } from "../../../src/components/Medals/MedalsList";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ModalMessage } from "../../../src/components/Modals/ModalMessage";
import { ModalRemoveFavoritePlayer } from "../../../src/components/Modals/ModalRemoveFavoritePlayer";
import { RectButton } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { TextComponent } from "../../../src/components/TextComponent";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useFavoritePlayersStore } from "@src/store/favorites";

export function Favorites() {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const { removeFavoritePlayer, favoritePlayers } = useFavoritePlayersStore();
  const [modalMessageVisible, setModalMessageVisible] = useState(false);
  const [modalFavoritesVisible, setModalFavoritesVisible] = useState(false);
  const [playerIdIndex, setPlayerIdIndex] = useState<number>();
  const router = useRouter();
  const textEmpty = englishLanguage
    ? "Empty List. To add, select as favorite on the header of Profile Player."
    : "Lista Vazia. Para adicionar, selecione como favorito no topo do Perfil do Jogador.";

  const messageText = englishLanguage
    ? "This profile is private"
    : "Este perfil é privado";

  const modalMessageRemove = englishLanguage
    ? "Do you wish remove this player from the favorite list?"
    : "Você deseja remover este jogador da lista de favoritos?";

  const styles = createStyles(ColorTheme);

  const HandleNavigateToProfile = (playerId: number | undefined) => {
    if (playerId === undefined) {
      setModalMessageVisible(true);
    } else {
      router.push({
        pathname: "/player-profile",
        params: {
          playerId: playerId.toString(),
        },
      });

      // navigation.navigate("PlayerProfile", { PlayerId: playerId.toString() });
    }
  };

  const handleDeletePlayer = (id: number) => {
    setModalFavoritesVisible(true);
    setPlayerIdIndex(id);
  };

  const SwipeableItem = ({ item }: { item: PlayerModel }) => {
    const renderLeftActions = (progress: any, dragX: any) => {
      return (
        <RectButton
          style={{
            paddingLeft: "7%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name="delete" color={"red"} size={23} />
        </RectButton>
      );
    };

    return (
      <Swipeable
        onSwipeableOpen={() => handleDeletePlayer(item.profile.account_id)}
        renderLeftActions={renderLeftActions}
      >
        <TouchableOpacity
          onPress={() => HandleNavigateToProfile(item.profile.account_id)}
          style={styles.itemContent}
        >
          <View style={styles.imgContainer}>
            <Image
              source={{ uri: `${Medal(item.rank_tier)}` }}
              style={styles.imageMedal}
            />
            <TextComponent style={styles.rankText}>
              {item?.leaderboard_rank}
            </TextComponent>
            <Image style={styles.imageProfile} src={item.profile.avatarfull} />
          </View>
          <TextComponent weight="semibold" style={styles.textProfileName}>
            {item.profile.name != ""
              ? item.profile.name
              : item.profile.personaname}
          </TextComponent>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, paddingTop: "7%", paddingBottom: "3%" }}>
        <TextComponent
          weight="bold"
          style={[
            styles.emptyList,
            {
              display: favoritePlayers.length == 0 ? "flex" : "none",
            },
          ]}
        >
          {textEmpty}
        </TextComponent>
        <ScrollView>
          <FlatList
            data={favoritePlayers}
            renderItem={({ item }) => <SwipeableItem item={item} />}
            keyExtractor={(item) => item.profile.account_id.toString()}
            scrollEnabled={false}
          />
        </ScrollView>
      </View>
      <Modal
        transparent={true}
        visible={modalMessageVisible}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ModalMessage
          handleClose={() => setModalMessageVisible(false)}
          title="Ops..."
          message={messageText}
        />
      </Modal>
      <Modal
        transparent={true}
        visible={modalFavoritesVisible}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ModalRemoveFavoritePlayer
          message={modalMessageRemove}
          removePlayer={() => removeFavoritePlayer(playerIdIndex ?? 0)}
          handleClose={() => setModalFavoritesVisible(false)}
        />
      </Modal>
    </View>
  );
}

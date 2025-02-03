import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";

import { createStyles } from "./styles";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { useFavoritesPlayersContext } from "../../../src/context/useFavoritesContext";
import { PlayerModel, RootStackParamList } from "../../../src/services/props";
import { Medal } from "../../../src/components/Medals/MedalsList";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { BannerAds } from "../../../src/components/BannerAds";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ModalMessage } from "../../../src/components/Modals/ModalMessage";
import { ModalFavoritePlayers } from "../../../src/components/Modals/ModalFavoritePlayer";
import { StackNavigationProp } from "@react-navigation/stack";
import { RectButton, Swipeable } from "react-native-gesture-handler";

export function Favorites() {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const { removeFavoritePlayer, favoritesPlayers } =
    useFavoritesPlayersContext();
  const [modalMessageVisible, setModalMessageVisible] = useState(false);
  const [modalFavoritesVisible, setModalFavoritesVisible] = useState(false);
  const [playerIdIndex, setPlayerIdIndex] = useState<number>();

  const messageText = englishLanguage
    ? "This profile is private"
    : "Este perfil é privado";

  const modalMessageRemove = englishLanguage
    ? "Do you wish remove this player from the favorite list?"
    : "Vocë deseja remover este jogador da lista de favoritos?";

  const navigation =
    useNavigation<
      StackNavigationProp<RootStackParamList, "PlayerProfile">
    >();

  const styles = createStyles(ColorTheme);


  const HandleNavigateToProfile = (playerId: number | undefined) => {
    if (playerId === undefined) {
      setModalMessageVisible(true);
    } else {
      navigation.navigate("PlayerProfile", { PlayerId: playerId.toString() });
    }
  };

  const handleDeletePlayer = (id: number) => {
    setModalFavoritesVisible(true);
    setPlayerIdIndex(id)
  }


  const SwipeableItem = ({ item }: { item: PlayerModel }) => {

    const renderLeftActions = (progress: any, dragX: any) => {
      return (<RectButton
        style={{
          paddingLeft: "7%",
          alignItems: "center",
          justifyContent: "center"
        }}
      >

        <MaterialCommunityIcons name="delete" color={"red"} size={23} />
      </RectButton>);
    };

    return (
      <Swipeable
        onSwipeableOpen={() => handleDeletePlayer(item.profile.account_id)}
        renderLeftActions={renderLeftActions}>
        <TouchableOpacity
          onPress={() => HandleNavigateToProfile(item.profile.account_id)}
          style={styles.itemContent} >
          <View
            style={styles.imgContainer}>
            <Image
              source={{ uri: `${Medal(item.rank_tier)}` }}
              style={styles.imageMedal}
            />
            <Image style={styles.imageProfile} src={item.profile.avatarfull} />
          </View>
          <Text style={styles.textProfileName}>
            {item.profile.name != ""
              ? item.profile.name
              : item.profile.personaname}
          </Text>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <BannerAds />
      <View>
        <Text
          style={{ display: favoritesPlayers.length == 0 ? "flex" : "none", fontFamily: "QuickSand-Semibold", textAlign: "center", fontSize: 17 }}
        >{englishLanguage ? "Empty List" : "Lista Vazia"}</Text>
        <FlatList
          style={{}}
          data={favoritesPlayers}
          renderItem={({ item }) => (<SwipeableItem item={item} />)}
          keyExtractor={(item) => item.profile.account_id.toString()}
          contentContainerStyle={{
            marginTop: "13%",
            maxHeight: "80%"
          }}
        />
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
        <ModalFavoritePlayers
          addAction={false}
          message={modalMessageRemove}
          removePlayer={() => removeFavoritePlayer(playerIdIndex ?? 0)}
          handleClose={() => setModalFavoritesVisible(false)}
        />
      </Modal>
    </View>
  );
}

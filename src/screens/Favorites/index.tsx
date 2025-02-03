import React from "react";
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
import { PlayerModel } from "../../../src/services/props";
import { Medal } from "../../../src/components/Medals/MedalsList";
import { FontAwesome } from "@expo/vector-icons";
import { BannerAds } from "../../../src/components/BannerAds";

export function Favorites() {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const { addFavoritePlayer, removeFavoritePlayer, favoritesPlayers } =
    useFavoritesPlayersContext();

  const styles = createStyles(ColorTheme);

  const renderFavoritesList = ({
    item,
    index,
  }: {
    item: PlayerModel;
    index: number;
  }) => {
    return (
      <View style={styles.itemContent}>
        <TouchableOpacity style={styles.imgContainer}>
          <Image
            source={{ uri: `${Medal(item.rank_tier)}` }}
            style={styles.imageMedal}
          />
          <Image style={styles.imageProfile} src={item.profile.avatarfull} />
        </TouchableOpacity>
        <Text style={styles.textProfileName}>
          {item.profile.name != ""
            ? item.profile.name
            : item.profile.personaname}
        </Text>
        <TouchableOpacity
          style={{
            width: "10%",
            alignItems: "center",
          }}
        >
          <FontAwesome name="remove" color={"red"} size={23} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BannerAds />
      <View>
        <Text>{}</Text>
        <FlatList
          data={favoritesPlayers}
          renderItem={renderFavoritesList}
          keyExtractor={(item) => item.profile.account_id.toString()}
          contentContainerStyle={{
            marginTop: "13%",
          }}
        />
      </View>
    </View>
  );
}

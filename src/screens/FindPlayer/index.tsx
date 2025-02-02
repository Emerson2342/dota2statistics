import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";

import { createStyles } from "./styles";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { searchPlayersByName } from "../../../src/API";
import { SEARCH_PLAYER_BASE_URL } from "../../../src/constants/player";
import { RootStackParamList, SearchUserResult } from "../../services/props";
import { BannerAds } from "../../../src/components/BannerAds";
import { ProgressBar, MD3Colors, Searchbar } from "react-native-paper";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

export const FindPlayer = () => {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);
  const [inputText, setInputText] = useState("");
  const [textSearch, setTextSearch] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [usersSearch, setUsersSearch] = useState<SearchUserResult[] | []>([]);

  const navigation =
    useNavigation<
      BottomTabNavigationProp<RootStackParamList, "PlayerProfile">
    >();

  const handleSearch = async (text: string) => {
    if (text.length < 4) {
      alert("Favor digitar mais do que 3 letras");
      return;
    }
    console.log("entrou na busca do jogador: ");
    setIsLoading(true);
    setTextSearch(text);

    const searchPlayerUrl = `${SEARCH_PLAYER_BASE_URL}${text}`;
    await searchPlayersByName(searchPlayerUrl, setUsersSearch);
    setInputText("");
    setIsLoading(false);
  };

  const HandleNavigateToProfile = (playerId: number | undefined) => {
    if (playerId === undefined) return;
    navigation.navigate("PlayerProfile", { PlayerId: playerId.toString() });
  };

  const renderPlayersList = ({
    item,
    index,
  }: {
    item: SearchUserResult;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => HandleNavigateToProfile(item.account_id)}
        key={index}
        style={{
          flexDirection: "row",
          width: "47%",
          alignItems: "center",
          margin: "1%",
          backgroundColor: "#fff",
        }}
      >
        <Image
          style={{ width: "20%", aspectRatio: 1, borderRadius: 5 }}
          src={item.avatarfull}
        />
        <Text
          numberOfLines={1}
          style={{ paddingLeft: "3%", width: "80%", color: "#555" }}
        >
          {item.personaname}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <BannerAds />
      <View style={styles.inputContainer}>
        <Searchbar
          style={styles.textInput}
          placeholder={englishLanguage ? "Search Player" : "Procurar Jogador"}
          value={inputText}
          // activeUnderlineColor={ColorTheme.standard}
          //textColor={ColorTheme.semidark}
          onChangeText={(textInput) => setInputText(textInput)}
          elevation={3}
          iconColor={ColorTheme.semidark}
          placeholderTextColor={ColorTheme.semilight}
          onIconPress={() => handleSearch(inputText)}
        //dense
        />
      </View>
      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ textAlign: "center" }}>
            {englishLanguage
              ? `Searching for "${textSearch}"`
              : `Buscando por "${textSearch}"`}
          </Text>
          <ActivityIndicator color={ColorTheme.semidark} size={30} />
          <ProgressBar indeterminate={true} color={MD3Colors.error100} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View
            style={{
              display: textSearch ? "flex" : "none",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.buttonCleanSearch}
              onPress={() => {
                setTextSearch(undefined), setUsersSearch([]);
              }}
            >
              <Text style={{ color: "#fff", fontFamily: "QuickSand-Semibold" }}>
                {englishLanguage ? "Clear Search" : "Limpar Pesquisa"}
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              textAlign: "center",
              marginVertical: "3%",
              fontFamily: "QuickSand-Semibold",
              display: textSearch ? "flex" : "none",
            }}
          >
            {usersSearch.length > 0
              ? englishLanguage
                ? `Results for "${textSearch}"`
                : `Resultados para "${textSearch}"`
              : englishLanguage
                ? `No results found for "${textSearch}"`
                : `Nenhum resultado encontrado para "${textSearch}"`}
          </Text>

          <FlatList
            data={usersSearch}
            renderItem={renderPlayersList}
            keyExtractor={(item) => item.account_id.toString()}
            numColumns={2}
          />
        </View>
      )}
    </View>
  );
};

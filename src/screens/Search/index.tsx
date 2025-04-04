import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
  Keyboard,
} from "react-native";

import { createStyles } from "./styles";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { searchPlayersByName } from "../../services/api";
import { SEARCH_PLAYER_BASE_URL } from "../../constants/player";
import { RootStackParamList, SearchUserResult } from "../../services/props";
import { BannerAds } from "../../components/Admob/BannerAds";
import {
  ProgressBar,
  MD3Colors,
  Searchbar,
  RadioButton,
} from "react-native-paper";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

export const Search = () => {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);
  const [inputText, setInputText] = useState("");
  const [textSearch, setTextSearch] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("player");

  const [usersSearch, setUsersSearch] = useState<SearchUserResult[] | []>([]);
  const textInfoProfile = englishLanguage
    ? "Search typing Steam ID or Nickname"
    : "Procure digitando o ID da steam ou apelido";

  const textInfoMatch = englishLanguage
    ? "Type the Match ID"
    : "Digite o ID da Partida";

  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList>>();

  const handleSearchPlayer = async (text: string) => {
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
    Keyboard.dismiss();
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

  const handleGoToMatch = (matchIndex: string) => {
    navigation.navigate("MatchDetails", {
      MatchDetailsIndex: parseInt(matchIndex),
      PlayerIdIndex: null,
    });
  };

  const handleSearch = async (input: string) => {
    if (searchType == "player") {
      await handleSearchPlayer(input);
    } else {
      handleGoToMatch(input);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Searchbar
          style={styles.textInput}
          placeholder={englishLanguage ? "Search" : "Buscar"}
          value={inputText}
          onChangeText={(textInput) => setInputText(textInput)}
          elevation={3}
          iconColor={ColorTheme.semidark}
          placeholderTextColor={ColorTheme.semilight}
          onIconPress={() => handleSearch(inputText)}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "50%",
          justifyContent: "space-around",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="player"
            status={searchType == "player" ? "checked" : "unchecked"}
            onPress={() => setSearchType("player")}
          />
          <Text>{englishLanguage ? "Profile" : "Perfil"}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RadioButton
            value="match"
            status={searchType === "match" ? "checked" : "unchecked"}
            onPress={() => setSearchType("match")}
          />
          <Text>{englishLanguage ? "Match" : "Partida"}</Text>
        </View>
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
          <Text
            style={[
              styles.emptyList,
              { display: usersSearch.length === 0 ? "flex" : "none" },
            ]}
          >
            {searchType === "player" ? textInfoProfile : textInfoMatch}
          </Text>
          <FlatList
            data={usersSearch}
            renderItem={renderPlayersList}
            keyExtractor={(item) => item.account_id.toString()}
            numColumns={2}
          />
        </View>
      )}
      <BannerAds />
    </View>
  );
};

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
  Keyboard,
  Modal,
} from "react-native";

import { createStyles } from "./styles";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { searchPlayersByName } from "../../services/api";
import { SEARCH_PLAYER_BASE_URL } from "../../constants/player";
import { SearchUserResult } from "../../services/props";
import { BannerAds } from "../../components/Admob/BannerAds";
import {
  ProgressBar,
  MD3Colors,
  Searchbar,
  RadioButton,
} from "react-native-paper";
import { ModalMessage } from "../../components/Modals/ModalMessage";
import { SearchComponent } from "../../../src/utils/SearchComponent";
import { useRouter } from "expo-router";

export const Search = () => {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);
  const [inputText, setInputText] = useState("");
  const [textSearch, setTextSearch] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("player");
  const [modalMessage, setModalMessage] = useState(false);
  const [modalMessageInput, setModalMessageInput] = useState(false);

  const router = useRouter();

  const [usersSearch, setUsersSearch] = useState<SearchUserResult[] | []>([]);
  const textInfoProfile = englishLanguage
    ? "Search typing Steam ID or Nickname"
    : "Procure digitando o ID da steam ou apelido";

  const textInfoMatch = englishLanguage
    ? "Type the Match ID"
    : "Digite o ID da Partida";

  const textLength = englishLanguage
    ? "Type at least 4 characters"
    : "Digite pelo menos 4 caracteres";

  const handleSearchPlayer = async (text: string) => {
    if (text.length < 4) {
      setModalMessage(true);
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
    // navigation.navigate("PlayerProfile", { PlayerId: playerId.toString() });
    router.push({
      pathname: "/player-profile",
      params: {
        playerId: playerId.toString(),
      },
    });
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
    if (matchIndex.length < 4) {
      setModalMessage(true);
      return;
    }
    router.push({
      pathname: "/match-details",
      params: {
        matchDetailsId: parseInt(matchIndex),
      },
    });
  };

  const handleSearch = async (input: string) => {
    if (searchType == "player") {
      await handleSearchPlayer(input);
    } else {
      handleGoToMatch(input);
    }
  };
  console.log(inputText);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <SearchComponent
          onSearch={handleSearch}
          placeHolder={englishLanguage ? "Search" : "Buscar"}
          showModalMessage={modalMessageInput}
          setShowModalMessage={() => setModalMessageInput(false)}
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
      <Modal
        visible={modalMessage}
        transparent={true}
        statusBarTranslucent={true}
        animationType="fade"
      >
        <ModalMessage
          handleClose={() => setModalMessage(false)}
          title={"Ops.."}
          message={textLength}
        />
      </Modal>
    </View>
  );
};

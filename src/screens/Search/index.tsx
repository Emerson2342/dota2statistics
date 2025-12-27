import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
  Keyboard,
  Modal,
  Switch,
} from "react-native";

import { createStyles } from "./styles";
import { fetchData } from "@src/services/api";
import { SEARCH_PLAYER_BASE_URL } from "@src/constants/player";
import { SearchUserResult } from "@src/services/props";
import { ModalMessage } from "@src/components/Modals/ModalMessage";
import { SearchComponent } from "@src/utils/SearchComponent";
import { useRouter } from "expo-router";
import { TextComponent } from "@src/components/TextComponent";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";
import { Feather, Fontisto, Ionicons, MaterialIcons } from "@expo/vector-icons";

type SearchType = "player" | "match";

export const Search = () => {
  const { englishLanguage } = useSettingsStore();
  const colorTheme = useThemeStore((state) => state.colorTheme);
  const styles = createStyles(colorTheme);
  const [textSearch, setTextSearch] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>("player");
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

  const playerSelected = searchType === "player";
  const matchSelected = searchType === "match";

  const handleSearchPlayer = async (text: string) => {
    if (text.length < 4) {
      setModalMessage(true);
      return;
    }
    console.log("entrou na busca do jogador: ");
    setIsLoading(true);
    setTextSearch(text);

    const searchPlayerUrl = `${SEARCH_PLAYER_BASE_URL}${text}`;
    await fetchData<SearchUserResult[]>(searchPlayerUrl)
      .then((res) => {
        setUsersSearch(res);
      })
      .catch(() =>
        console.error(
          englishLanguage
            ? "Error trying to get results"
            : "Erro ao buscar resultados"
        )
      );
    //await searchPlayersByName(searchPlayerUrl, setUsersSearch);
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
        <TextComponent
          numberOfLines={1}
          style={{ paddingLeft: "3%", width: "80%", color: "#555" }}
        >
          {item.personaname}
        </TextComponent>
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

  return (
    <View style={styles.container}>
      <TextComponent
        weight="semibold"
        style={[
          styles.emptyList,
          { display: usersSearch.length === 0 ? "flex" : "none" },
        ]}
      >
        {searchType === "player" ? textInfoProfile : textInfoMatch}
      </TextComponent>
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 13,
            marginVertical: 7,
          }}
        >
          <TouchableOpacity
            onPress={() => setSearchType("player")}
            style={{ flexDirection: "row", gap: 7 }}
          >
            <MaterialIcons
              name={playerSelected ? "radio-button-on" : "radio-button-off"}
              color={colorTheme.semidark}
              size={23}
            />
            <TextComponent weight="bold" style={{ color: colorTheme.dark }}>
              {englishLanguage ? "Profile" : "Perfil"}
            </TextComponent>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row", gap: 7 }}
            onPress={() => setSearchType("match")}
          >
            <MaterialIcons
              name={matchSelected ? "radio-button-on" : "radio-button-off"}
              color={colorTheme.semidark}
              size={23}
            />
            <TextComponent style={{ color: colorTheme.dark }} weight="bold">
              {englishLanguage ? "Match" : "Partida"}
            </TextComponent>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <TextComponent weight="bold" style={{ textAlign: "center" }}>
            {englishLanguage
              ? `Searching for "${textSearch}"`
              : `Buscando por "${textSearch}"`}
          </TextComponent>
          <ActivityIndicator color={colorTheme.semidark} size={30} />
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
              <TextComponent weight="semibold" style={{ color: "#fff" }}>
                {englishLanguage ? "Clear Search" : "Limpar Pesquisa"}
              </TextComponent>
            </TouchableOpacity>
          </View>
          <TextComponent
            weight="semibold"
            style={{
              textAlign: "center",
              marginVertical: "3%",
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
          </TextComponent>
          <FlatList
            data={usersSearch}
            renderItem={renderPlayersList}
            keyExtractor={(item) => item.account_id.toString()}
            numColumns={2}
          />
        </View>
      )}
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

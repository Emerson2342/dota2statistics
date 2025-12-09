import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import {
  HeroDetailsModel,
  HeroesPlayed,
  ThemeColor,
} from "../../../services/props";
import { useSettingsContext } from "../../../context/useSettingsContext";
import { useTheme } from "../../../context/useThemeContext";
import HeroesDetails from "../../../components/Heroes/HeroesDetails.json";
import { PICTURE_HERO_BASE_URL } from "../../../constants/player";
import { ActivityIndicatorCustom } from "../../../../src/utils/ActivityIndicatorCustom";
import { usePlayerContext } from "@src/context/usePlayerContex";
import { getSetProfile } from "@src/utils/textMessage";
import { TextComponent } from "@src/components/TextComponent";

function HeroesPlayedComp({
  isHomeProfile,
  heroesPlayedList,
  refresh,
  isLoading,
}: {
  isHomeProfile: boolean;
  heroesPlayedList: HeroesPlayed[];
  refresh: () => Promise<void>;
  isLoading: boolean;
}) {
  const { player } = usePlayerContext();
  const { englishLanguage } = useSettingsContext();
  const [orderToShow, setOrderToShow] = useState("matches");

  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);
  const setSteamId = getSetProfile(englishLanguage);
  const [orderedList, setOrderedList] =
    useState<HeroesPlayed[]>(heroesPlayedList);

  const erro404 = englishLanguage
    ? "Unable to access player data. The profile may be set to private."
    : "Não foi possível acessar os dados do jogador. Perfil pode estar como privado.";

  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];

  const handleSetOrder = (order: string) => {
    setOrderToShow(order);
    if (order != orderToShow) {
      const ordered = [...heroesPlayedList].sort((a, b) => {
        if (order === "lastPlayed") {
          return b.last_played - a.last_played;
        } else if (order === "winrate") {
          const winrateA = a.win / a.games;
          const winrateB = b.win / b.games;
          return winrateB - winrateA;
        } else if (order === "matches") {
          return b.games - a.games;
        } else if (order === "wins") {
          return b.win - a.win;
        }
        return 0;
      });
      setOrderedList(ordered);
    }
  };

  const RenderItem = ({
    item,
    index,
  }: {
    item: HeroesPlayed;
    index: number;
  }) => {
    const startDate = new Date(item.last_played * 1000);
    const hoursDate = startDate.getHours();
    const minutesDate = startDate.getMinutes();

    const formattedTime = `${hoursDate
      .toString()
      .padStart(2, "0")}:${minutesDate.toString().padStart(2, "0")}`;

    const heroIndex = heroArray.find((hero) => hero.id === item.hero_id);

    const winrate = (item.win / item.games) * 100;

    return (
      <View
        style={[
          styles.renderItemContainer,
          {
            backgroundColor: index % 2 === 0 ? ColorTheme.light : "transparent",
          },
        ]}
      >
        <Image
          style={styles.imageHero}
          source={{ uri: PICTURE_HERO_BASE_URL + heroIndex?.img }}
        />
        <TextComponent
          weight="semibold"
          style={[styles.textInfo, { width: "33%" }]}
        >
          {startDate.toLocaleDateString(englishLanguage ? "en-US" : "pt-BR")}-
          {formattedTime}
        </TextComponent>
        <TextComponent
          weight="semibold"
          style={[styles.textInfo, { width: "17%" }]}
        >
          {winrate.toFixed(2)}%
        </TextComponent>

        <TextComponent
          weight="semibold"
          style={[styles.textInfo, { width: "20%" }]}
        >
          {item.games}
        </TextComponent>
        <TextComponent
          weight="semibold"
          style={[styles.textInfo, { width: "17%" }]}
        >
          {item.win}
        </TextComponent>
      </View>
    );
  };

  if (isLoading)
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicatorCustom
          message={
            englishLanguage
              ? "Loading player details..."
              : "Carrgando detalhes do jogador..."
          }
        />
      </View>
    );
  if (isHomeProfile && (player == null || player.profile.account_id == 0)) {
    return (
      <View style={{ flex: 1 }}>
        <TextComponent weight="semibold" style={styles.textErro}>
          {setSteamId}
        </TextComponent>
      </View>
    );
  }

  if (heroesPlayedList.length === 0)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <TextComponent weight="bold" style={styles.textMessage}>
          {erro404}
        </TextComponent>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => handleSetOrder("lastPlayed")}
          style={{ width: "37%" }}
        >
          <TextComponent
            weight="bold"
            style={[
              styles.textInfo,
              styles.textInfoTitle,
              {
                borderBottomWidth: orderToShow === "lastPlayed" ? 2 : 0,
              },
            ]}
          >
            {englishLanguage ? "Last Played" : "Último Jogo"}
          </TextComponent>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSetOrder("winrate")}
          style={{ width: "21%" }}
        >
          <TextComponent
            weight="bold"
            style={[
              styles.textInfo,
              styles.textInfoTitle,
              { borderBottomWidth: orderToShow === "winrate" ? 2 : 0 },
            ]}
          >
            {englishLanguage ? "Winrate" : "Taxa Vitória"}
          </TextComponent>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSetOrder("matches")}
          style={{ width: "22%" }}
        >
          <TextComponent
            weight="bold"
            style={[
              styles.textInfo,
              styles.textInfoTitle,
              {
                borderBottomWidth: orderToShow === "matches" ? 2 : 0,
              },
            ]}
          >
            {englishLanguage ? "Matches" : "Partidas"}
          </TextComponent>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSetOrder("wins")}
          style={{ width: "20%" }}
        >
          <TextComponent
            weight="bold"
            style={[
              styles.textInfo,
              styles.textInfoTitle,
              {
                borderBottomWidth: orderToShow === "wins" ? 2 : 0,
              },
            ]}
          >
            {englishLanguage ? "Wins" : "Vitórias"}
          </TextComponent>
        </TouchableOpacity>
      </View>
      <FlatList
        data={orderedList}
        renderItem={RenderItem}
        keyExtractor={(item) => item.hero_id.toLocaleString()}
        initialNumToRender={20}
      />
    </View>
  );
}

export const HeroesPlayedComponent = React.memo(HeroesPlayedComp);
HeroesPlayedComponent.displayName = "HeroesPlayed";

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      width: "97%",
    },
    renderItemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    imageHero: {
      width: "13%",
      aspectRatio: 1.7,
      resizeMode: "contain",
      borderRadius: 3,
    },
    headerContainer: {
      flexDirection: "row",
      width: "87%",
      alignSelf: "flex-end",
      alignItems: "baseline",
      marginVertical: "1.5%",
      justifyContent: "space-around",
    },
    contentError: {
      flex: 0.9,
      justifyContent: "center",
      alignItems: "center",
    },
    textInfo: {
      fontSize: Dimensions.get("screen").width * 0.035,
      color: colors.dark,
      textAlign: "center",
    },
    textInfoTitle: {
      borderColor: "orange",
    },
    inputContainer: {
      marginTop: "3%",
      width: "95%",
      alignItems: "center",
      justifyContent: "space-around",
    },
    textErro: {
      textAlign: "center",
      padding: "5%",
      color: colors.semidark,
    },
    textMessage: {
      textAlign: "center",
      padding: "5%",
      fontFamily: "QuickSand-Semibold",
      color: colors.semidark,
    },
  });

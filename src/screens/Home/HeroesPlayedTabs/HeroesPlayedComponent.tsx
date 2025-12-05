import React, { useEffect, useState } from "react";
import {
  View,
  Text,
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
import {
  PICTURE_HERO_BASE_URL,
  PLAYER_PROFILE_API_BASE_URL,
} from "../../../constants/player";
import { ActivityIndicatorCustom } from "../../../../src/utils/ActivityIndicatorCustom";
import { usePlayerContext } from "../../../context/usePlayerContex";
import { getSetProfile } from "../../../../src/utils/textMessage";
import { getHeroesPlayed } from "../../../../src/services/api";
import { ErrorComponent } from "../../../../src/utils/ErrorComponent";

function HeroesPlayedComp({
  isHomeProfile,
}: {
  isHomeProfile: boolean;
}) {
  const { player } = usePlayerContext();
  const { englishLanguage } = useSettingsContext();
  const [heroArray, setHeroArray] = useState<HeroDetailsModel[]>([]);
  const [orderToShow, setOrderToShow] = useState("matches");

  const [isLoading, setIsLoading] = useState(true);
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);
  const setSteamId = getSetProfile(englishLanguage);
  const [finalList, setFinalList] = useState<HeroesPlayed[] | []>([]);
  const [orderedList, setOrderedList] = useState<HeroesPlayed[]>(finalList);
  const [errorResponse, setErrorResponse] = useState(false);

  useEffect(() => {
    setHeroArray(Object.values(HeroesDetails) as HeroDetailsModel[]);
    //if(isHomeProfile)
    handleGetHeroesPlayed();
  }, [player]);

  const handleGetHeroesPlayed = async () => {
    setIsLoading(true);
    const heroesPlayed = `${PLAYER_PROFILE_API_BASE_URL}${player?.profile.account_id}/heroes`;
    const heroesPlayedResponse = await getHeroesPlayed(
      heroesPlayed,
      setErrorResponse
    );
    if (heroesPlayedResponse && heroesPlayedResponse?.length > 0) {
      setFinalList(heroesPlayedResponse);
      setOrderedList(heroesPlayedResponse);
    }
    setIsLoading(false);
  };

  const handleSetOrder = (order: string) => {
    setOrderToShow(order);
    if (order != orderToShow) {
      const ordered = [...finalList].sort((a, b) => {
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
        <Text style={[styles.textInfo, { width: "33%" }]}>
          {startDate.toLocaleDateString(englishLanguage ? "en-US" : "pt-BR")}-
          {formattedTime}
        </Text>
        <Text style={[styles.textInfo, { width: "17%" }]}>
          {winrate.toFixed(2)}%
        </Text>

        <Text style={[styles.textInfo, { width: "20%" }]}>{item.games}</Text>
        <Text style={[styles.textInfo, { width: "17%" }]}>{item.win}</Text>
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
        <Text style={styles.textErro}>{setSteamId}</Text>
      </View>
    );
  }

  if (errorResponse) return <ErrorComponent action={handleGetHeroesPlayed} />;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => handleSetOrder("lastPlayed")}
          style={{ width: "37%" }}
        >
          <Text
            style={[
              styles.textInfo,
              styles.textInfoTitle,
              {
                borderBottomWidth: orderToShow === "lastPlayed" ? 2 : 0,
              },
            ]}
          >
            {englishLanguage ? "Last Played" : "Último Jogo"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSetOrder("winrate")}
          style={{ width: "21%" }}
        >
          <Text
            style={[
              styles.textInfo,
              styles.textInfoTitle,
              { borderBottomWidth: orderToShow === "winrate" ? 2 : 0 },
            ]}
          >
            {englishLanguage ? "Winrate" : "Taxa Vitória"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSetOrder("matches")}
          style={{ width: "22%" }}
        >
          <Text
            style={[
              styles.textInfo,
              styles.textInfoTitle,
              {
                borderBottomWidth: orderToShow === "matches" ? 2 : 0,
              },
            ]}
          >
            {englishLanguage ? "Matches" : "Partidas"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSetOrder("wins")}
          style={{ width: "20%" }}
        >
          <Text
            style={[
              styles.textInfo,
              styles.textInfoTitle,
              {
                borderBottomWidth: orderToShow === "wins" ? 2 : 0,
              },
            ]}
          >
            {englishLanguage ? "Wins" : "Vitórias"}
          </Text>
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
    textError: {
      fontFamily: "QuickSand-Semibold",
      padding: "3%",
      textAlign: "center",
    },
    textHeroName: {
      fontFamily: "QuickSand-Bold",
      textAlign: "center",
      fontSize: Dimensions.get("screen").width * 0.037,
      color: "orange",
      margin: "1%",
    },

    textInfo: {
      fontSize: Dimensions.get("screen").width * 0.035,
      color: colors.dark,
      fontFamily: "QuickSand-Semibold",
      textAlign: "center",
    },
    textInfoTitle: {
      fontFamily: "QuickSand-Bold",
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
      fontFamily: "QuickSand-Semibold",
      color: colors.semidark,
    },
    textInput: {
      backgroundColor: "#fff",
      textAlign: "center",
      fontFamily: "QuickSand-Semibold",
      flexGrow: 1,
      marginHorizontal: "5%",
    },
  });

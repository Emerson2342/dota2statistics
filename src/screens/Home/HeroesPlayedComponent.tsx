import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import {
  HeroDetailsModel,
  HeroesPlayed,
  ThemeColor,
} from "../../../src/services/props";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
import { PICTURE_HERO_BASE_URL } from "../../../src/constants/player";
import { RadioButton } from "react-native-paper";
import { BannerAds } from "../../components/Admob/BannerAds";

export function HeroesPlayedComponent({
  HeroesPlayedList,
  successPlayerAccount,
  textError,
}: {
  HeroesPlayedList: HeroesPlayed[];
  successPlayerAccount: boolean;
  textError: string;
}) {
  const { englishLanguage } = useSettingsContext();
  const [heroArray, setHeroArray] = useState<HeroDetailsModel[]>([]);
  const [orderToShow, setOrderToShow] = useState("lastPlayed");
  const [orderedList, setOrderedList] =
    useState<HeroesPlayed[]>(HeroesPlayedList);
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);

  useEffect(() => {
    setHeroArray(Object.values(HeroesDetails) as HeroDetailsModel[]);
  }, []);

  const handleSetOrder = (order: string) => {
    setOrderToShow(order);
    if (order != orderToShow) {
      const ordered = [...HeroesPlayedList].sort((a, b) => {
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

  if (!successPlayerAccount) {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.contentError}>
          <Text
            style={[
              styles.textError,
              {
                color: ColorTheme.semidark,
              },
            ]}
          >
            {textError}
          </Text>
        </View>
        <View style={{ flex: 0.1 }}>
          <BannerAds />
        </View>
      </View>
    );
  }

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
      <BannerAds />
    </View>
  );
}

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
      marginVertical: "3%",
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
      alignSelf: "center",
    },
    textInfoTitle: {
      fontFamily: "QuickSand-Bold",
      borderColor: "orange",
    },
  });

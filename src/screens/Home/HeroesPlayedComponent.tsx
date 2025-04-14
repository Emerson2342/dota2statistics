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
  const [checked, setChecked] = useState("mostPlayed");
  const [orderedList, setOrderedList] =
    useState<HeroesPlayed[]>(HeroesPlayedList);
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);

  useEffect(() => {
    setHeroArray(Object.values(HeroesDetails) as HeroDetailsModel[]);
  }, []);

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
        <Text style={[styles.textInfo, { width: "30%" }]}>
          {startDate.toLocaleDateString(englishLanguage ? "en-US" : "pt-BR")}-
          {formattedTime}
        </Text>
        <Text style={[styles.textInfo, { width: "20%" }]}>
          {winrate.toFixed(2)}%
        </Text>

        <Text style={[styles.textInfo, { width: "20%" }]}>{item.games}</Text>
        <Text style={[styles.textInfo, { width: "17%" }]}>{item.win}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>
        {englishLanguage ? "Most Played" : "Mais Jogados"}
      </Text>
      <View style={styles.headerContainer}>
        <Text style={[styles.textInfo, { width: "30%" }]}>
          {englishLanguage ? "Last Played" : "Último Jogo"}
        </Text>
        <Text style={[styles.textInfo, { width: "20%" }]}>
          {englishLanguage ? "Winrate" : "Taxa Vitória"}
        </Text>
        <Text style={[styles.textInfo, { width: "20%" }]}>
          {englishLanguage ? "Matches" : "Partidas"}
        </Text>
        <Text style={[styles.textInfo, { width: "17%" }]}>
          {englishLanguage ? "Wins" : "Vitórias"}
        </Text>
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

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      width: "97%",
    },
    textTitle: {
      fontSize: Dimensions.get("screen").width * 0.04,
      textAlign: "center",
      fontFamily: "QuickSand-Bold",
      color: "#fff",
      backgroundColor: colors.semidark,
      padding: 3,
      marginVertical: "2%",
      paddingHorizontal: "7%",
      borderRadius: 7,
      alignSelf: "center",
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
      color: colors.dark,
      fontFamily: "QuickSand-Semibold",
      textAlign: "center",
      alignSelf: "center",
    },
  });

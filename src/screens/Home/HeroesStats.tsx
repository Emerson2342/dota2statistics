import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import {
  HeroDetailsModel,
  HeroStats,
  LeagueMatches,
  RootStackParamList,
  ThemeColor,
} from "../../services/props";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { useNavigation } from "@react-navigation/native";
import { PICTURE_HERO_BASE_URL } from "../../../src/constants/player";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import HeroesDetails from "../../components/Heroes/HeroesDetails.json";
export function HeroesStats({
  heroesStats,
}: {
  heroesStats: HeroStats[] | [];
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);
  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];
  const navigation =
    useNavigation<DrawerNavigationProp<RootStackParamList, "HeroDetails">>();

  const bestWinrate = heroesStats
    .map((hero) => {
      const winRate =
        hero.pub_pick > 0 ? (hero.pub_win / hero.pub_pick) * 100 : 0;

      return {
        ...hero,
        winRate: winRate,
      };
    })
    .sort((a, b) => b.winRate - a.winRate);

  const mostPicked = heroesStats
    .map((hero) => {
      return hero;
    })
    .sort((a, b) => b.pub_pick - a.pub_pick);

  // const pickedSum = heroesStats.reduce((sum, h) => sum + h.pub_pick, 0);

  const GoToHeroDetails = (item: number) => {
    const heroDetails = heroArray.find((hero) => hero.id === item);
    if (heroDetails) {
      navigation.navigate("HeroDetails", { heroDetails: heroDetails });
    } else {
      alert("Hero not found");
    }
  };

  return (
    <View style={{ marginTop: "3%" }}>
      <View style={styles.content}>
        <Text style={styles.textHeader}>
          {englishLanguage ? "Trending Heroes" : "Heróis Em Alta"}
        </Text>
        <Text
          style={[
            styles.text,
            { fontSize: Dimensions.get("screen").width * 0.037 },
          ]}
        >
          {englishLanguage ? "Pick Rate" : "Mais Escolhidos"}
        </Text>
        <View style={styles.container}>
          {mostPicked &&
            mostPicked.slice(0, 8).map((item: HeroStats, index: number) => {
              const urlImg = PICTURE_HERO_BASE_URL + item.img;

              return (
                <TouchableOpacity
                  onPress={() => GoToHeroDetails(item.id)}
                  key={index}
                >
                  <Image source={{ uri: urlImg }} style={styles.imgHero} />
                  <Text style={styles.text}>{index + 1}°</Text>
                </TouchableOpacity>
              );
            })}
        </View>

        <Text
          style={[
            styles.text,
            { fontSize: Dimensions.get("screen").width * 0.035 },
          ]}
        >
          {englishLanguage ? "Win Rate" : "Aproveitamento"}
        </Text>
        <View style={styles.container}>
          {bestWinrate &&
            bestWinrate.slice(0, 8).map((item: HeroStats, index: number) => {
              const urlImg = PICTURE_HERO_BASE_URL + item.img;

              return (
                <TouchableOpacity
                  onPress={() => GoToHeroDetails(item.id)}
                  key={index}
                >
                  <Image source={{ uri: urlImg }} style={styles.imgHero} />
                  <Text style={styles.text}>{item.winRate?.toFixed(2)}%</Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    content: {
      borderRadius: 7,
      backgroundColor: "#fff",
      marginHorizontal: "2%",
      paddingVertical: "1%",
    },
    textHeader: {
      fontSize: Dimensions.get("screen").width * 0.05,
      textAlign: "center",
      fontFamily: "QuickSand-Bold",
      color: colors.semidark,
      alignSelf: "center",
      borderBottomWidth: 1,
      borderColor: colors.dark,
      width: "90%",
    },
    text: {
      fontSize: Dimensions.get("window").width * 0.025,
      color: colors.semidark,
      fontFamily: "QuickSand-Semibold",
      textAlign: "center",
    },
    imgHero: {
      width: Dimensions.get("screen").width * 0.1,
      height: undefined,
      aspectRatio: 1.5,
      marginHorizontal: "0.5%",
      borderRadius: 3,
    },
  });

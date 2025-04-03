import React from "react";
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
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { PICTURE_HERO_BASE_URL } from "../../../src/constants/player";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
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
      const totalPicks = hero.pub_pick + hero.turbo_picks;
      const totalWins = hero.pub_win + hero.turbo_wins;
      const winRate = totalPicks > 0 ? (totalWins / totalPicks) * 100 : 0;

      return {
        ...hero,
        winRate: winRate,
      };
    })
    .sort((a, b) => b.winRate - a.winRate);

  const mostPicked = heroesStats
    .map((hero) => {
      const totalPicks = hero.pub_pick + hero.turbo_picks;

      return {
        ...hero,
        totalPicks: totalPicks,
      };
    })
    .sort((a, b) => b.totalPicks - a.totalPicks);

  const GoToHeroDetails = (item: number) => {
    const heroDetails = heroArray.find((hero) => hero.id === item);
    if (heroDetails) {
      navigation.navigate("HeroDetails", { heroDetails: heroDetails });
    } else {
      alert("Hero not found");
    }
  };

  return (
    <View style={{}}>
      <Text style={styles.textTitle}>
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
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    textTitle: {
      fontSize: Dimensions.get("screen").width * 0.04,
      textAlign: "center",
      fontFamily: "QuickSand-Bold",
      color: "#fff",
      padding: 3,
      paddingHorizontal: "7%",
      borderRadius: 7,
      backgroundColor: colors.semidark,
      //width: "70%",
      alignSelf: "center",
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
      marginHorizontal: "1%",
      borderRadius: 3,
    },
  });

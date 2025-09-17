import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { HeroStats, ThemeColor } from "../../../services/props";
import { useRouter } from "expo-router";
import { useSettingsContext } from "../../../context/useSettingsContext";
import { useTheme } from "../../../context/useThemeContext";
import { PICTURE_HERO_BASE_URL } from "../../../constants/player";

function HeroesStatsComponent({
  heroesStats,
}: {
  heroesStats: HeroStats[] | [];
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);
  const router = useRouter();
  // const navigation =
  //   useNavigation<DrawerNavigationProp<RootStackParamList, "HeroDetails">>();

  const bestWinrate = useMemo(
    () =>
      heroesStats
        .map((hero) => ({
          ...hero,
          winRate: hero.pub_pick > 0 ? (hero.pub_win / hero.pub_pick) * 100 : 0,
        }))
        .sort((a, b) => b.winRate - a.winRate),
    [heroesStats]
  );

  const mostPicked = useMemo(
    () => [...heroesStats].sort((a, b) => b.pub_pick - a.pub_pick),
    [heroesStats]
  );

  const GoToHeroDetails = (heroId: number) => {
    router.push({
      pathname: "/hero-details",
      params: {
        heroId: heroId.toString(),
      },
    });
  };

  return (
    <View style={{ marginTop: "3%" }}>
      <View style={styles.content}>
        <Text style={styles.textHeader}>
          {englishLanguage ? "Trending Heroes" : "Heróis Em Alta"}
        </Text>

        <Text style={[styles.text, styles.textTitle]}>
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

        <Text style={[styles.text, styles.textTitle]}>
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

export const HeroesStats = React.memo(HeroesStatsComponent);
HeroesStats.displayName = "HeroesStats";

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    content: {
      borderRadius: 7,
      marginHorizontal: "2%",
      paddingVertical: "1%",
    },
    textHeader: {
      fontSize: Dimensions.get("screen").width * 0.05,
      textAlign: "center",
      fontFamily: "QuickSand-Bold",
      color: "#fff",
      alignSelf: "center",
      width: "90%",
      borderRadius: 7,
      padding: 3,
      backgroundColor: colors.semidark,
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
    textTitle: {
      fontSize: Dimensions.get("screen").width * 0.037,
      backgroundColor: colors.light,
      width: "50%",
      alignSelf: "center",
      padding: 3,
      margin: 5,
      borderRadius: 7,
    },
  });

import React, { useMemo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { HeroStats, ThemeColor } from "@src/services/props";
import { useRouter } from "expo-router";
import { PICTURE_HERO_BASE_URL } from "@src/constants/player";
import { TextComponent } from "@src/components/TextComponent";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";

function HeroesStatsComponent({
  heroesStats,
}: {
  heroesStats: HeroStats[] | [];
}) {
  const { englishLanguage } = useSettingsStore();
  const colorTheme = useThemeStore((state) => state.colorTheme);

  const styles = createStyles(colorTheme);
  const router = useRouter();

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
      <TextComponent weight="bold" style={styles.textHeader}>
        {englishLanguage ? "Trending Heroes" : "Heróis Em Alta"}
      </TextComponent>
      <View style={styles.content}>
        <TextComponent
          weight="semibold"
          style={[styles.text, styles.textTitle]}
        >
          {englishLanguage ? "Pick Rate" : "Mais Escolhidos"}
        </TextComponent>
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
                  <TextComponent weight="semibold" style={styles.text}>
                    {index + 1}°
                  </TextComponent>
                </TouchableOpacity>
              );
            })}
        </View>

        <TextComponent
          weight="semibold"
          style={[styles.text, styles.textTitle]}
        >
          {englishLanguage ? "Win Rate" : "Aproveitamento"}
        </TextComponent>
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
                  <TextComponent weight="semibold" style={styles.text}>
                    {item.winRate?.toFixed(2)}%
                  </TextComponent>
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
      borderRadius: 13,
      marginHorizontal: "2%",
      paddingVertical: "1%",
      backgroundColor: "#fff",
      elevation: 13,
    },
    textHeader: {
      fontSize: Dimensions.get("screen").width * 0.05,
      textAlign: "center",
      color: colors.semidark,
      alignSelf: "center",
      width: "90%",
      borderRadius: 7,
      padding: 3,
    },
    text: {
      fontSize: Dimensions.get("window").width * 0.025,
      color: colors.semidark,
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
      width: "50%",
      alignSelf: "center",
      padding: 3,
      margin: 5,
      borderRadius: 7,
    },
  });

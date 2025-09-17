import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";

import {
  HeroDetailsModel,
  HeroMatchUps,
  ThemeColor,
} from "../../../src/services/props";
import { useTheme } from "../../../src/context/useThemeContext";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { fetchHeroMatchups } from "../../../src/services/api";
import { ActivityIndicatorCustom } from "../../../src/utils/ActivityIndicatorCustom";
import useHeroDetails from "../../utils/getHeroDetails";
import { PICTURE_HERO_BASE_URL } from "../../../src/constants/player";
import getHeroDetails from "../../utils/getHeroDetails";

type Props = {
  heroId: string;
};

export const MatchUps = ({ heroId }: Props) => {
  const { ColorTheme } = useTheme();
  const { englishLanguage } = useSettingsContext();
  const [errorResponse, setErrorResponse] = useState(false);
  const [heroMatchups, setHeroMatchups] = useState<HeroMatchUps[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = createStyles(ColorTheme);
  const textTitle = englishLanguage ? "Matchups Against" : "Desempenho Contra";

  useEffect(() => {
    setLoading(true);
    fetchHeroMatchups(heroId)
      .then((data) => {
        const withWinrate = data.map((i) => ({
          ...i,
          winrate: (i.wins / i.games_played) * 100,
        }));

        const finalList = withWinrate.filter((item) => item.winrate != 0);
        setHeroMatchups(finalList);
        setErrorResponse(false);
      })
      .catch(() => setErrorResponse(true))
      .finally(() => setLoading(false));
  }, []);

  const bestResults = [...heroMatchups]
    .sort((a, b) => b.winrate - a.winrate)
    .slice(0, 7);

  const worstResults = [...heroMatchups]
    .sort((a, b) => a.winrate - b.winrate)
    .slice(0, 7);

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.titleText}>{textTitle}</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={{ flexDirection: "row", gap: 7 }}>
            {bestResults.map((m) => {
              const hero = getHeroDetails(m.hero_id);
              if (!hero) return null;

              return (
                <View key={m.hero_id}>
                  <Image
                    style={styles.image}
                    source={{ uri: PICTURE_HERO_BASE_URL + hero.img }}
                  />
                  <Text style={styles.textPercent}>
                    {m.winrate.toFixed(2)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
};

const createStyles = (Colors: ThemeColor) =>
  StyleSheet.create({
    itemContainer: {
      flex: 1,
      padding: "3%",
      backgroundColor: "#fff",
      margin: "3%",
      borderRadius: 7,
      alignItems: "center",
      elevation: 7,
      width: "95%",
    },
    titleText: {
      fontFamily: "QuickSand-Bold",
      color: "#fff",
      alignSelf: "center",
      textAlign: "center",
      fontSize: Dimensions.get("screen").width * 0.03,
      borderRadius: 5,
      marginBottom: "3%",
      width: "50%",
      padding: "1%",
      backgroundColor: Colors.semidark,
    },
    image: {
      width: 35,
      height: 35,
      borderRadius: 7,
    },
    textPercent: {
      fontFamily: "QuickSand-Semibold",
      fontSize: 13,
      color: "#0d5030",
    },
    textFormat: {
      backgroundColor: Colors.light,
      padding: 5,
      paddingHorizontal: 15,
      margin: 5,
      borderRadius: 7,
      color: Colors.semidark,
    },
  });

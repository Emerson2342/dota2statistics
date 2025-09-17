import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicatorComponent,
  ActivityIndicator,
} from "react-native";

import { HeroMatchUps, ThemeColor } from "../../../src/services/props";
import { useTheme } from "../../../src/context/useThemeContext";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { fetchHeroMatchups } from "../../../src/services/api";
import { ActivityIndicatorCustom } from "../../../src/utils/ActivityIndicatorCustom";

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
  const textTitle = englishLanguage ? "Matchups" : "Desempenho";
  const textLoading = englishLanguage ? "Loading..." : "Carregando";

  useEffect(() => {
    setLoading(true);
    fetchHeroMatchups(heroId)
      .then((data) => {
        setHeroMatchups(data);
        setErrorResponse(false);
      })
      .catch(() => setErrorResponse(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.titleText}>{textTitle}</Text>
      {loading ? <ActivityIndicator /> : <Text>{heroMatchups.length}</Text>}
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
      marginBottom: "1%",
      width: "50%",
      padding: "1%",
      backgroundColor: Colors.semidark,
    },
  });

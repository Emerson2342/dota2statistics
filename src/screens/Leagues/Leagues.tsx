import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Button,
} from "react-native";

import { createStyles } from "./LeaguesStyles";
import { League } from "../../services/props";
import { LEAGUES_BASE_URL } from "../../../src/constants/player";
import { useTheme } from "../../../src/context/useThemeContext";
import { ModalMessage } from "../../../src/components/Modals/ModalMessage";
import { BannerAds } from "../../components/Admob/BannerAds";
import { useFocusEffect, useRouter } from "expo-router";
import { ActivityIndicatorCustom } from "../../../src/utils/ActivityIndicatorCustom";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { ErrorComponent } from "../../../src/utils/ErrorComponent";

export function Leagues() {
  const { ColorTheme } = useTheme();
  const { englishLanguage } = useSettingsContext();

  const styles = createStyles(ColorTheme);

  const [leagueList, setLeagueList] = useState<League[] | []>([]);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorRequest, setErrorRequest] = useState(false);
  useFocusEffect(
    useCallback(() => {
      console.log("****Leagues List");
      loadLeagues();
    }, [])
  );

  const goToLeagueMatches = (id: number, name: string) => {
    router.push({
      pathname: "/league-matches",
      params: {
        leagueId: id,
        leagueName: name ?? "",
      },
    });
  };

  const loadLeagues = async () => {
    setIsLoading(true);
    setErrorRequest(false);
    try {
      const keywords = ["2024", "2025", "24", "25"];
      const response = await fetch(LEAGUES_BASE_URL);
      const data = (await response.json()) as League[];
      const resultFiltered = data.filter(
        (l) =>
          (l.tier === "premium" || l.tier === "professional") &&
          keywords.some((k) => l.name.toLowerCase().includes(k.toLowerCase()))
      );
      const sortedLeagues = [...resultFiltered].sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? "", "en-US", {
          sensitivity: "base",
          numeric: true,
        })
      );

      setLeagueList(sortedLeagues);
    } catch (error: any) {
      setLeagueList([]);
      setErrorRequest(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: League }) => {
    return (
      <TouchableOpacity
        style={styles.containerCards}
        onPress={() => goToLeagueMatches(item.leagueid, item.name)}
      >
        <Text style={styles.textLeagueName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading)
    return (
      <ActivityIndicatorCustom
        message={
          englishLanguage ? "Loading Leagues..." : "Carregando Campeonatos..."
        }
      />
    );
  if (errorRequest) return <ErrorComponent action={loadLeagues} />;

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <FlatList
          data={leagueList}
          renderItem={renderItem}
          keyExtractor={(item) => item.leagueid.toString()}
        />
      </View>
      <BannerAds />
    </View>
  );
}

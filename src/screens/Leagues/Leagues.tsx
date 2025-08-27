import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  FlatList,
} from "react-native";

import { createStyles } from "./LeaguesStyles";
import { League } from "../../services/props";
import { LEAGUES_BASE_URL } from "../../../src/constants/player";
import { useTheme } from "../../../src/context/useThemeContext";
import { ModalMessage } from "../../../src/components/Modals/ModalMessage";
import { BannerAds } from "../../components/Admob/BannerAds";
import { useFocusEffect, useRouter } from "expo-router";

export function Leagues() {
  const { ColorTheme } = useTheme();

  const styles = createStyles(ColorTheme);

  const [leagueList, setLeagueList] = useState<League[] | []>([]);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState(false);
  const [erroMessage, setErrorMessage] = useState<string>("");

  const goToLeagueMatches = (id: number, name: string) => {
    router.push({
      pathname: "/league-matches",
      params: {
        leagueId: id,
        leagueName: name ?? "",
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      console.log("****Leagues List");
      loadLeagues();
    }, [])
  );

  const loadLeagues = async () => {
    setIsLoading(true);
    try {
      const keywords = ["2024", "2025", "24", "25"];
      const response = await fetch(LEAGUES_BASE_URL);
      const data = (await response.json()) as League[];
      const resultFiltered = data.filter(
        (l) =>
          (l.tier === "premium" || l.tier === "professional") &&
          keywords.some((k) => l.name.toLowerCase().includes(k.toLowerCase()))
      );
      const sortedLeagues = resultFiltered.sort(
        (a, b) => b.leagueid - a.leagueid
      );
      setLeagueList(sortedLeagues);
    } catch (error: any) {
      setErrorMessage(error);
      setModalMessage(true);
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

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View>
          {isLoading ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size={"large"} color={ColorTheme.semilight} />
            </View>
          ) : (
            <FlatList
              data={leagueList}
              renderItem={renderItem}
              keyExtractor={(item) => item.leagueid.toString()}
            />
          )}
        </View>
      </View>
      <Modal
        visible={modalMessage}
        transparent={true}
        statusBarTranslucent={true}
        animationType="fade"
      >
        <ModalMessage
          handleClose={() => setModalMessage(false)}
          title="Erro"
          message={erroMessage}
        />
      </Modal>
      <BannerAds />
    </View>
  );
}

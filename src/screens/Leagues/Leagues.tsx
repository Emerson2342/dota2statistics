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
import {
  FontModel,
  League,
  RootStackParamList,
  Team,
} from "../../services/props";
import {
  LEAGUES_BASE_URL,
  TEAMS_BASE_URL,
} from "../../../src/constants/player";
import { useTheme } from "../../../src/context/useThemeContext";
import { ModalMessage } from "../../../src/components/Modals/ModalMessage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTimestampContext } from "../../../src/context/useTimestampContext";
import { useTeamsListContext } from "../../../src/context/useTeamContext";
import { useFonts } from "expo-font";
import { BannerAds } from "../../../src/components/BannerAds";
import { AsyncStorageService } from "../../../src/services/StorageService";

export function Leagues() {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "LeagueDetails">>();

  const { ColorTheme } = useTheme();

  const styles = createStyles(ColorTheme);

  const [leagueList, setLeagueList] = useState<League[] | []>([]);
  const { leagueTimestamp, setLeagueTimestamp } = useTimestampContext();
  const { setTeamsList } = useTeamsListContext();

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState(false);
  const [erroMessage, setErrorMessage] = useState<string>("");

  const goToLeagueMatches = (id: number, name: string) => {
    navigation.navigate("LeagueDetails", {
      LeagueIdIndex: id,
      LeagueName: name,
    });
  };

  const asyncStorage = new AsyncStorageService();

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedLeagueList = await asyncStorage.getItem<League[]>(
          "leagueList"
        );

        if (storedLeagueList !== null) {
          setLeagueList(storedLeagueList);
        }
      } catch (error) {
        console.error("Erro ao carregar dados armazenados", error);
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    const saveAsyncData = async () => {
      try {
        await asyncStorage.setItem("leagueList", leagueList);
      } catch (error) {
        console.error("Erro ao salvar dados no AsyncStorage:", error);
      }
    };
    saveAsyncData();
  }, [leagueList]);

  useFocusEffect(
    useCallback(() => {
      if (
        leagueTimestamp == null ||
        leagueTimestamp + 86000 < currentTimestamp
      ) {
        loadLeagues();
        loadTeamsList();
      }
    }, [leagueTimestamp])
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
      setLeagueTimestamp(currentTimestamp);
    } catch (error: any) {
      setErrorMessage(error);
      setModalMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(leagueList.length);

  const loadTeamsList = async () => {
    try {
      const response = await fetch(TEAMS_BASE_URL);
      const data = (await response.json()) as Team[];
      const sortedTeamsList = data.sort((a, b) => a.name.localeCompare(b.name));
      setTeamsList(sortedTeamsList);
    } catch (error: any) {
      setErrorMessage(error);
      setModalMessage(true);
    } finally {
    }
  };

  console.log(leagueTimestamp);

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
      <BannerAds />
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
    </View>
  );
}

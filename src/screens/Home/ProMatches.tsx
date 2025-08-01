import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";

import { createStylesStatics } from "./ProMatchesStyles";

import { LeagueMatches, RootStackParamList } from "../../services/props";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";
import { Skeleton } from "moti/skeleton";

export function ProMatches({
  proMatches,
  onRefresh,
}: {
  proMatches: LeagueMatches[] | [];
  onRefresh: () => Promise<void>;
}) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const styles = createStylesStatics(ColorTheme);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    console.log("Refresh pro matches");
    setLoading(true);
    await onRefresh();
    setLoading(false);
  }, []);

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const formattedTimeMatch = proMatches.map((item) => {
    const durationInMinutes = item?.duration;
    const startHour = Math.floor(durationInMinutes / 60);
    const startMinutes = durationInMinutes % 60;

    const formattedHours = String(startHour).padStart(2, "0");
    const formattedMinutes = String(startMinutes).padStart(2, "0");
    const formattedDuration = `${formattedHours}min ${formattedMinutes}s`;

    const matchEndTime = item?.start_time + item?.duration;
    const timeSinceEnd = currentTimestamp - matchEndTime;
    const hours = Math.floor(timeSinceEnd / 3600);
    const minutes = Math.floor((timeSinceEnd % 3600) / 60);

    const formattedEndHours = String(hours).padStart(2, "0");
    const formattedEndMinutes = String(minutes).padStart(2, "0");
    const formattedEndDuration =
      formattedEndHours == "00"
        ? `${formattedEndMinutes}min`
        : `${formattedEndHours}h${formattedEndMinutes}min`;

    return { ...item, formattedEndDuration, formattedDuration };
  });

  const handleGoToMatch = (matchIndex: number) => {
    navigation.navigate("MatchDetails", {
      MatchDetailsIndex: matchIndex,
      PlayerIdIndex: null,
    });
  };

  const handleGoToLeagueMatches = (
    LeagueIdIndex: number,
    LeagueName: string | null
  ) => {
    navigation.navigate("LeagueDetails", {
      LeagueIdIndex: LeagueIdIndex,
      LeagueName: LeagueName ?? "",
    });
  };

  const ProMatchItem = ({
    item,
    formattedEndDuration,
    formattedDuration,
  }: {
    item: LeagueMatches;
    formattedEndDuration: string;
    formattedDuration: string;
  }) => {
    return (
      <View key={item.match_id} style={styles.matchContainer}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <Text style={styles.leagueName} numberOfLines={1}>
            {item.league_name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View style={styles.teamRow}>
            <Text
              style={[
                styles.teamName,
                {
                  color: item.radiant_win ? "#257848" : "#9a2525",
                },
              ]}
            >
              {item.radiant_name || "Radiant"}
            </Text>
            <Text
              style={[
                styles.score,
                { color: item.radiant_win ? "#257848" : "#9a2525" },
              ]}
            >
              {item.radiant_score}
            </Text>
          </View>
          <View style={styles.teamRow}>
            <Text
              style={[
                styles.score,
                { color: item.radiant_win ? "#9a2525" : "#257848" },
              ]}
            >
              {item.dire_score}
            </Text>
            <Text
              style={[
                styles.teamName,
                { color: item.radiant_win ? "#9a2525" : "#257848" },
              ]}
            >
              {item.dire_name || "Dire"}
            </Text>
          </View>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.textData}>
            {englishLanguage ? "Duration: " : "Duração: "}
            {formattedDuration}
          </Text>

          <Text style={styles.textData}>
            {englishLanguage
              ? `Finished ${formattedEndDuration} ago`
              : `Finalizado ${formattedEndDuration} atrás`}
          </Text>
        </View>
        <View style={styles.linkContainer}>
          <View style={{ width: "50%", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() =>
                handleGoToLeagueMatches(item.leagueid, item.league_name)
              }
              style={styles.buttonContainer}
            >
              <Text style={styles.textButton}>
                {englishLanguage ? "Tournament " : "Campeonato "}
                <Feather name="external-link" />
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: "50%", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => handleGoToMatch(item.match_id)}
              style={styles.buttonContainer}
            >
              <Text style={styles.textButton}>
                {englishLanguage ? "Match " : "Partida "}
                <Feather name="external-link" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>
        {englishLanguage ? "Pro Matches" : "Partidas Profissionais"}
      </Text>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refresh}
            colors={[
              ColorTheme.light,
              ColorTheme.semilight,
              ColorTheme.standard,
            ]}
            progressBackgroundColor={ColorTheme.dark}
          />
        }
      >
        <FlatList
          data={formattedTimeMatch}
          renderItem={({ item }) => (
            <ProMatchItem
              item={item}
              formattedEndDuration={item.formattedEndDuration}
              formattedDuration={item.formattedDuration}
            />
          )}
          keyExtractor={(item) => item.match_id.toString()}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}

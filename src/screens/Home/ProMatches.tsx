import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";

import { createStylesStatics } from "./ProMatchesStyles";

import { LeagueMatches, RootStackParamList } from "../../services/props";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { usePlayerContext } from "../../context/usePlayerContex";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";

export function ProMatches({
  proMatchesOpen,
  onClick,
}: {
  proMatchesOpen: boolean;
  onClick: () => void;
}) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { englishLanguage } = useSettingsContext();
  const { proMatches } = usePlayerContext();
  const { ColorTheme } = useTheme();
  const styles = createStylesStatics(ColorTheme);

  const list = proMatchesOpen ? proMatches : proMatches.slice(0, 1);

  const formattedTimeMatch = list.map((item) => {
    const startDate = new Date(item?.start_time * 1000);
    const durationInMinutes = item?.duration;
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedDuration = `${formattedHours}:${formattedMinutes}`;

    const hoursDate = startDate.getHours();
    const minutesDate = startDate.getMinutes();

    const formattedTime = `${startDate.toLocaleDateString(
      englishLanguage ? "en-US" : "pt-BR"
    )}-${hoursDate.toString().padStart(2, "0")}:${minutesDate
      .toString()
      .padStart(2, "0")}`;

    return { ...item, formattedDuration, formattedTime };
  });

  const handleGoToMatch = (
    matchIndex: number,
    leagueName: string | null,
    radName: string | null,
    direName: string | null
  ) => {
    navigation.navigate("MatchDetails", {
      MatchDetailsIndex: matchIndex,
      PlayerIdIndex: null,
      RadiantName: radName || undefined,
      DireName: direName || undefined,
      LeagueNameIndex: leagueName || null,
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
    formattedDuration,
    formattedTime,
  }: {
    item: LeagueMatches;
    formattedDuration: string;
    formattedTime: string;
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
            {englishLanguage ? "Date: " : "Data: "}
            {formattedTime}
          </Text>

          <Text style={styles.textData}>
            {englishLanguage ? "Duration: " : "Duração: "}
            {formattedDuration}
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
              onPress={() =>
                handleGoToMatch(
                  item.match_id,
                  item.league_name,
                  item.radiant_name,
                  item.dire_name
                )
              }
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
      <TouchableOpacity onPress={() => onClick()} style={styles.titleContainer}>
        <Text style={styles.textTitle}>
          {englishLanguage
            ? "Last Pro Matches"
            : "Últimas Partidas Profissionais"}
          {"   "}
          <Feather
            name={proMatchesOpen ? "chevrons-down" : "chevrons-up"}
            size={20}
            color={"#fff"}
          />
        </Text>
      </TouchableOpacity>

      <FlatList
        data={formattedTimeMatch}
        renderItem={({ item }) => (
          <ProMatchItem
            item={item}
            formattedDuration={item.formattedDuration}
            formattedTime={item.formattedTime}
          />
        )}
        keyExtractor={(item) => item.match_id.toString()}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        scrollEnabled={proMatchesOpen}
      />
    </View>
  );
}

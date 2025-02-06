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
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "LeagueDetails">>();
  const navigationLeagueMatches =
    useNavigation<StackNavigationProp<RootStackParamList, "LeagueDetails">>();

  const { englishLanguage } = useSettingsContext();
  const { proMatches } = usePlayerContext();
  const { ColorTheme } = useTheme();

  const list = proMatchesOpen ? proMatches : proMatches.slice(0, 1);

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

  const styles = createStylesStatics(ColorTheme);

  const renderList = ({
    item,
    index,
  }: {
    item: LeagueMatches;
    index: number;
  }) => {
    return (
      <View key={index} style={styles.matchContainer}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <Text style={styles.leagueName} numberOfLines={1}>
            {item.league_name}
          </Text>
        </View>
        <View style={{ flexDirection: "row", width: "100%" }}>
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
        data={list}
        renderItem={renderList}
        keyExtractor={(item) => item.match_id.toString()}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        scrollEnabled={proMatchesOpen}
      />
    </View>
  );
}

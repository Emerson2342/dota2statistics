import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";

import { createStylesStatics } from "./ProMatchesStyles";

import {
  LeagueMatches,
  RootStackParamList,
} from "../../services/props";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { usePlayerContext } from "../../context/usePlayerContex";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";

export function ProMatches({ proMatchesOpen }: { proMatchesOpen: boolean }) {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "LeagueDetails">>();
  const { englishLanguage } = useSettingsContext();
  const { proMatches } = usePlayerContext();
  const { ColorTheme } = useTheme();

  const list = proMatchesOpen ? proMatches : proMatches.slice(0, 2);

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
  const styles = createStylesStatics(ColorTheme);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
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
      </View>
      <ScrollView style={{ paddingHorizontal: "1.7%" }}>
        <View style={styles.content}>
          {list.map((item: LeagueMatches, index: number) => {
            return (
              <Animated.View key={index} style={styles.matchContainer}>
                <TouchableOpacity
                  onPress={() =>
                    handleGoToMatch(
                      item.match_id,
                      item.league_name,
                      item.radiant_name,
                      item.dire_name
                    )
                  }
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.leagueName}
                  >
                    {item.league_name}
                  </Text>
                  <View style={styles.teamRow}>
                    <Text
                      style={[
                        styles.score,
                        { color: item.radiant_win ? "#257848" : "#9a2525" },
                      ]}
                    >
                      {item.radiant_score}
                    </Text>
                    <Text
                      style={[
                        styles.teamName,
                        { color: item.radiant_win ? "#257848" : "#9a2525" },
                      ]}
                    >
                      {item.radiant_name || "Radiant"}
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
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

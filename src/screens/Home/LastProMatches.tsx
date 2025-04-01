import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  LeagueMatches,
  RootStackParamList,
  ThemeColor,
} from "../../../src/services/props";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

export function LastProMatches({
  proMatches,
}: {
  proMatches: LeagueMatches[] | [];
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const styles = createStyles(ColorTheme);

  const radName = englishLanguage ? "Radiante" : "Iluminados";
  const direName = englishLanguage ? "Dire" : "Temidos";

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleGoToMatch = (matchIndex: number) => {
    navigation.navigate("MatchDetails", {
      MatchDetailsIndex: matchIndex,
      PlayerIdIndex: null,
    });
  };

  const renderItem = ({ item }: { item: LeagueMatches }) => {
    return (
      <TouchableOpacity
        onPress={() => handleGoToMatch(item.match_id)}
        style={styles.matchContainer}
      >
        <Text
          style={[
            styles.textTeamName,
            { color: item.radiant_win ? "#DAF1DB" : "#FBEAEC" },
          ]}
        >
          {item.radiant_score} - {item.radiant_name ?? radName}
        </Text>
        <Text
          style={[
            styles.textTeamName,
            { color: item.radiant_win ? "#FBEAEC" : "#DAF1DB" },
          ]}
        >
          {item.dire_score} - {item.dire_name ?? direName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ marginBottom: 17 }}>
      <Text style={styles.textTitle}>
        {englishLanguage
          ? "Last Pro Matches"
          : "últimas Partidas Profissionais"}
      </Text>
      <FlatList
        data={proMatches.slice(0, 12)}
        renderItem={renderItem}
        keyExtractor={(item) => item.match_id.toString()}
        numColumns={2}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    textTitle: {
      fontFamily: "QuickSand-Bold",
      textAlign: "center",
      color: colors.dark,
    },
    matchContainer: {
      backgroundColor: colors.semidark,
      width: "49.5%",
      margin: "0.25%",
      borderRadius: 1.3,
      padding: "1%",
    },
    textTeamName: {
      fontSize: Dimensions.get("window").width * 0.03,
      color: colors.light,
      fontFamily: "QuickSand-Bold",
    },
  });

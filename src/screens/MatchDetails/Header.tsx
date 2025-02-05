import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { MatchDetailsModel, ThemeColor } from "../../services/props";

export function Header({
  LeagueNameIndex,
  RadiantName,
  DireName,
  matchDetails,
}: {
  LeagueNameIndex: string | null;
  RadiantName: string | undefined;
  DireName: string | undefined;
  matchDetails: MatchDetailsModel | null;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();

  const radName = englishLanguage ? "Radiant" : "Iluminados";
  const direName = englishLanguage ? "Dire" : "Temidos";

  let formattedDuration;
  let formattedTime;

  if (matchDetails) {
    const startDate = new Date(matchDetails?.start_time * 1000);
    const durationInMinutes = matchDetails?.duration;
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    formattedDuration = `${formattedHours}:${formattedMinutes}`;

    const hoursDate = startDate.getHours();
    const minutesDate = startDate.getMinutes();

    formattedTime = `${startDate.toLocaleDateString(
      englishLanguage ? "en-US" : "pt-BR"
    )}-${hoursDate.toString().padStart(2, "0")}:${minutesDate
      .toString()
      .padStart(2, "0")}`;
  }

  const styles = createStyles(ColorTheme);
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.textTitleLeague,
          { display: LeagueNameIndex ? "flex" : "none" },
        ]}
      >
        {LeagueNameIndex}
      </Text>
      <View style={{ width: "100%", alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
          }}
        >
          <View style={styles.scoreContainer}>
            <Text
              numberOfLines={1}
              style={[styles.teamName, { textAlign: "right" }]}
            >
              {RadiantName ? RadiantName : radName}{" "}
            </Text>
            <Text style={styles.teamScore}>{matchDetails?.radiant_score}</Text>
          </View>
          <Text
            style={{
              color: ColorTheme.standard,
              fontFamily: "QuickSand-Semibold",
            }}
          >
            {" "}
            X{" "}
          </Text>
          <View
            style={[styles.scoreContainer, { justifyContent: "flex-start" }]}
          >
            <Text style={styles.teamScore}>{matchDetails?.dire_score}</Text>
            <Text
              numberOfLines={1}
              style={[styles.teamName, { textAlign: "left" }]}
            >
              {" "}
              {DireName ? DireName : direName}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "85%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#000",
                fontFamily: "QuickSand-Bold",
              }}
            >
              {englishLanguage ? "Duration: " : "Duração: "}
            </Text>
            <Text
              style={{
                color: "#000",
                fontFamily: "QuickSand-Semibold",
              }}
            >
              {formattedDuration}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#000",
                fontFamily: "QuickSand-Bold",
              }}
            >
              {englishLanguage ? "Date: " : "Data: "}
            </Text>
            <Text
              style={{
                color: "#000",
                fontFamily: "QuickSand-Semibold",
              }}
            >
              {formattedTime}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.textId}>{englishLanguage ? "Match Id: " : "Id da Partida"}{matchDetails?.match_id}</Text>
    </View>
  );
}

const { width } = Dimensions.get("window");
const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      alignSelf: "center",
    },
    textTitleLeague: {
      fontSize: width * 0.05,
      color: colors.semidark,
      fontFamily: "QuickSand-Bold",
      textAlign: "center",
    },
    scoreContainer: {
      flexDirection: "row",
      width: "48%",
      justifyContent: "flex-end",
    },
    teamName: {
      color: colors.standard,
      fontFamily: "QuickSand-Bold",
      textAlign: "center",
      width: "87%",
    },
    teamScore: {
      color: colors.standard,
      fontFamily: "QuickSand-Bold",
      alignSelf: "center",
    },
    textId: {
      fontFamily: "QuickSand-Semibold",
      textAlign: "center",
      color: "#777"
    }
  });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useSettingsContext } from "../../context/useSettingsContext";
import { useTheme } from "../../context/useThemeContext";
import { MatchDetailsModel, ThemeColor } from "../../services/props";
import { ModalMessage } from "../../../src/components/Modals/ModalMessage";
import { Ionicons } from "@expo/vector-icons";

export function Header({
  matchDetails,
}: {
  matchDetails: MatchDetailsModel | null;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const [modalMessageVisible, setModalMessageVisible] = useState(false);
  const radName = englishLanguage ? "Radiant" : "Iluminados";

  const textWarning = englishLanguage
    ? "This match does not have detailed data available. For more details, access the OpenDota link and request a match analysis. Once analyzed, please refresh the page by pulling down the screen."
    : "Esta partida não tem dados detalhados disponíveis. Para mais informações, acesse o site do OpenDota e solicite a análise. O OpenDota é um serviço externo e pode exigir tempo para processar os dados. " +
      "Ao término da análise, favor atualizar os detalhes da partida puxando para baixo a tela.";

  const direName = englishLanguage ? "Dire" : "Temidos";

  let formattedDuration;
  let formattedTime;

  const styles = createStyles(ColorTheme);
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

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.textTitleLeague,
          { display: matchDetails?.league?.name ? "flex" : "none" },
        ]}
      >
        {matchDetails?.league?.name ?? ""}
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
              {matchDetails?.radiant_team?.name ?? radName}{" "}
            </Text>
            <Text style={styles.teamScore}>{matchDetails?.radiant_score}</Text>
          </View>
          <Text
            style={{
              color: ColorTheme.semidark,
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
              {matchDetails?.dire_team?.name ?? direName}
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
                color: ColorTheme.semidark,
                fontFamily: "QuickSand-Bold",
              }}
            >
              {englishLanguage ? "Duration: " : "Duração: "}
            </Text>
            <Text
              style={{
                color: ColorTheme.semidark,
                fontFamily: "QuickSand-Semibold",
              }}
            >
              {formattedDuration}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: ColorTheme.semidark,
                fontFamily: "QuickSand-Bold",
              }}
            >
              {englishLanguage ? "Date: " : "Data: "}
            </Text>
            <Text
              style={{
                color: ColorTheme.semidark,
                fontFamily: "QuickSand-Semibold",
              }}
            >
              {formattedTime}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "3%",
          marginBottom: "3%",
        }}
      >
        <Text style={styles.textId}>
          {englishLanguage ? "Match Id: " : "Id da Partida: "}
          {matchDetails?.match_id}
        </Text>
        <TouchableOpacity
          style={{
            marginLeft: 3,
            display:
              matchDetails?.radiant_gold_adv &&
              matchDetails.radiant_gold_adv.length > 0
                ? "none"
                : "flex",
          }}
          onPress={() => setModalMessageVisible(true)}
        >
          <Ionicons name="warning" color={"orange"} size={17} />
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalMessageVisible}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
      >
        <ModalMessage
          handleClose={() => setModalMessageVisible(false)}
          title={englishLanguage ? "Attencion" : "Atenção"}
          message={textWarning}
          link={true}
          matchId={matchDetails?.match_id}
        />
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get("window");
const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      alignSelf: "center",
      backgroundColor: "#fff",
      margin: "3%",
      borderRadius: 9,
      padding: "1%",
      elevation: 7,
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
      alignItems: "center",
    },
    teamName: {
      color: colors.semidark,
      fontFamily: "QuickSand-Bold",
      textAlign: "center",
      width: "87%",
    },
    teamScore: {
      color: colors.semidark,
      fontFamily: "QuickSand-Bold",
      alignSelf: "center",
      fontSize: 17,
    },
    textId: {
      fontFamily: "QuickSand-Semibold",
      textAlign: "center",
      color: "#aaa",
    },
  });

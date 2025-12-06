import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSettingsContext } from "../../../context/useSettingsContext";
import { useTheme } from "../../../context/useThemeContext";
import { MatchDetailsModel, ThemeColor } from "../../../services/props";
import { ModalMessage } from "../../../components/Modals/ModalMessage";
import { Ionicons } from "@expo/vector-icons";

function Header({
  matchDetails,
  lobbyType,
  gameMode,
  radName,
  direName,
}: {
  matchDetails: MatchDetailsModel | null;
  lobbyType?: string;
  gameMode?: string;
  radName: string;
  direName: string;
}) {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const [modalMessageVisible, setModalMessageVisible] = useState(false);

  const textWarning = englishLanguage
    ? "This match does not have detailed data available. For more details, access the OpenDota link and request a match analysis. Once analyzed, please refresh the page by pulling down the screen."
    : "Esta partida não tem dados detalhados disponíveis. Para mais informações, acesse o site do OpenDota e solicite a análise. O OpenDota é um serviço externo e pode exigir tempo para processar os dados. " +
      "Ao término da análise, favor atualizar os detalhes da partida puxando para baixo a tela.";

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
      <Text style={styles.textTitleLeague}>
        {matchDetails?.league?.name ?? `${lobbyType} - ${gameMode}`}
      </Text>
      <View style={{ width: "100%", alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View
            style={{
              width: "50%",
              alignItems: "center",
            }}
          >
            {matchDetails?.radiant_team?.logo_url ? (
              <View style={styles.shieldContainer}>
                <Image
                  source={{ uri: matchDetails.radiant_team.logo_url }}
                  style={{
                    width: 37,
                    aspectRatio: 1,
                    backgroundColor: "#000",
                    borderRadius: 7,
                  }}
                />
              </View>
            ) : (
              <View
                style={{
                  width: matchDetails?.dire_team?.logo_url ? 37 : 0,
                  height: matchDetails?.dire_team?.logo_url ? 37 : 0,
                }}
              />
            )}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text
                numberOfLines={1}
                style={[styles.teamName, { textAlign: "center" }]}
              >
                {radName}
              </Text>
              <Text style={styles.teamScore}>
                {matchDetails?.radiant_score}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "50%",
              alignItems: "center",
            }}
          >
            {matchDetails?.dire_team?.logo_url ? (
              <View style={[styles.shieldContainer, { alignSelf: "flex-end" }]}>
                <Image
                  source={{ uri: matchDetails.dire_team.logo_url }}
                  style={{
                    width: 37,
                    aspectRatio: 1,
                    backgroundColor: "#000",
                    borderRadius: 7,
                  }}
                />
              </View>
            ) : (
              <View
                style={{
                  width: matchDetails?.radiant_team?.logo_url ? 37 : 0,
                  height: matchDetails?.radiant_team?.logo_url ? 37 : 0,
                }}
              />
            )}
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.teamScore}>{matchDetails?.dire_score}</Text>
              <Text
                numberOfLines={1}
                style={[styles.teamName, { textAlign: "center" }]}
              >
                {direName}
              </Text>
            </View>
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

export const HeaderComponent = React.memo(Header);
HeaderComponent.displayName = "HeaderComponent";

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
      borderBottomWidth: 1,
      borderColor: "#ccc",
      marginBottom: 7,
      paddingBottom: 7,
    },
    scoreContainer: {
      flexDirection: "row",
      width: "48%",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    shieldContainer: {
      width: "80%",
      alignItems: "center",
      alignSelf: "flex-start",
    },
    teamName: {
      color: colors.semidark,
      fontFamily: "QuickSand-Bold",
      textAlign: "center",
      width: "80%",
    },
    teamScore: {
      color: colors.semidark,
      fontFamily: "QuickSand-Bold",
      textAlign: "center",
      fontSize: Dimensions.get("screen").width * 0.037,
      width: "20%",
    },
    textId: {
      fontFamily: "QuickSand-Semibold",
      textAlign: "center",
      color: "#aaa",
    },
  });

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../../src/context/useThemeContext";
import { useSettingsContext } from "../../../../src/context/useSettingsContext";
import { usePlayerContext } from "../../../context/usePlayerContex";
import {
  PlayerModel,
  RecentMatches,
  ThemeColor,
} from "../../../../src/services/props";
import { ProfileHeader } from "./ProfileHeader";
import { LastMatches } from "./LastMatches";
import { ActivityIndicatorCustom } from "../../../../src/utils/ActivityIndicatorCustom";
import { toSteam32 } from "../../../../src/utils/steam";
import { SearchComponent } from "../../../../src/utils/SearchComponent";
import { getErro404Message } from "../../../../src/utils/textMessage";

export function MyProfileTabs() {
  const { ColorTheme } = useTheme();
  const { player, heroesPlayedId, recentMatches, isLoadingContext, handleFetchPlayerData } =
    usePlayerContext();
  const { englishLanguage } = useSettingsContext();
  const [isLoading, setIsLoading] = useState(true);
  const [showModalMessage, setShowModalMessage] = useState(false);

  const erro404 = getErro404Message(englishLanguage);
  const styles = createStyles(ColorTheme);

  const handleSave = (id: string) => {
    if (!/^\d+$/.test(id)) {
      setShowModalMessage(true);
      return;
    }
    const convertedId = toSteam32(id);
    if (!convertedId) {
      setShowModalMessage(true);
      return;
    }
    setIsLoading(true);
    setTimeout(async () => {
      await handleFetchPlayerData(convertedId);
    }, 300);
  };

  function renderSetSteamId() {
    return (
      <View style={styles.inputContainer}>
        <Text>{JSON.stringify(player, null, 2)}</Text>
        <SearchComponent
          onSearch={handleSave}
          placeHolder="Steam ID"
          showModalMessage={showModalMessage}
          setShowModalMessage={() => setShowModalMessage(false)}
        />
        <Text style={styles.textErro}>{erro404}</Text>
      </View>
    );
  }

  if (isLoadingContext)
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicatorCustom
          message={
            englishLanguage
              ? "Loading player details..."
              : "Carrgando detalhes do jogador..."
          }
        />
      </View>
    );

  if (player == null || player.profile.account_id == 0) {
    console.log("Carregou....");

    return renderSetSteamId();
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: heroesPlayedId.length > 5 ? 0.3 : 0.28,
          marginTop: "1%",
        }}
      >
        <ProfileHeader
          player={player}
          heroesId={heroesPlayedId}
          recentMatches={recentMatches}
        />
      </View>
      <View style={{ flex: heroesPlayedId.length > 5 ? 0.7 : 0.72 }}>
        <View style={{ flex: 1, paddingBottom: "1%" }}>
          {player ? (
            <LastMatches
              playerId={player.profile.account_id.toString()}
              onRefresh={() => handleFetchPlayerData(player.profile.account_id.toString())}
              recentMatches={recentMatches}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    inputContainer: {
      flex: 1,
      width: "100%",
      alignItems: "center",
    },
    textErro: {
      textAlign: "center",
      padding: "5%",
      fontFamily: "QuickSand-Semibold",
      color: colors.semidark,
    },
    textInput: {
      backgroundColor: "#fff",
      textAlign: "center",
      fontFamily: "QuickSand-Semibold",
      flexGrow: 1,
      marginHorizontal: "5%",
    },
  });

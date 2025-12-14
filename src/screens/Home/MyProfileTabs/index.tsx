import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ThemeColor } from "@src/services/props";
import { ProfileHeader } from "./ProfileHeader";
import { LastMatches } from "./LastMatches";
import { ActivityIndicatorCustom } from "@src/components/ActivityIndicatorCustom";
import { toSteam32 } from "@src/utils/steam";
import { SearchComponent } from "@src/utils/SearchComponent";
import { getErro404Message } from "@src/utils/textMessage";
import { TextComponent } from "@src/components/TextComponent";
import { usePlayerStore } from "@src/store/player";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  index: number;
};

export function MyProfileTabs({ index }: Props) {
  const colorTheme = useThemeStore((state) => state.colorTheme);

  const {
    playerId,
    player,
    heroesPlayedId,
    recentMatches,
    isLoadingContext,
    handleFetchPlayerData,
    setPlayerId,
    hasFetchedInitialData,
  } = usePlayerStore();
  const { englishLanguage } = useSettingsStore();
  const [showModalMessage, setShowModalMessage] = useState(false);

  useEffect(() => {
    if (index != 1) return;
    if (player) return;
    if (hasFetchedInitialData) return;
    handleFetchPlayerData(playerId ?? "");
  }, []);

  const erro404 = getErro404Message(englishLanguage);
  const styles = createStyles(colorTheme);

  const handleSave = async (id: string) => {
    if (!/^\d+$/.test(id)) {
      setShowModalMessage(true);
      return;
    }
    const convertedId = toSteam32(id);
    if (!convertedId) {
      setShowModalMessage(true);
      return;
    }
    setPlayerId(convertedId);
    await handleFetchPlayerData(convertedId);
  };

  function renderSetSteamId() {
    return (
      <View style={styles.inputContainer}>
        <SearchComponent
          onSearch={handleSave}
          placeHolder="Steam ID"
          showModalMessage={showModalMessage}
          setShowModalMessage={() => setShowModalMessage(false)}
        />
        <TextComponent weight="semibold" style={styles.textErro}>
          {erro404}
        </TextComponent>
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
              : "Carregando detalhes do jogador..."
          }
        />
      </View>
    );

  if (player == null || player.profile.account_id == 0) {
    return renderSetSteamId();
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: heroesPlayedId.length > 5 ? 0.3 : 0.28,
        }}
      >
        <LinearGradient
          // Background Linear Gradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={styles.background}
        />
        <ProfileHeader
          player={player}
          heroesId={heroesPlayedId}
          recentMatches={recentMatches}
        />
      </View>
      <View style={{ flex: heroesPlayedId.length > 5 ? 0.7 : 0.72 }}>
        <View style={{ flex: 1, paddingBottom: "1%" }}>
          {player && (
            <LastMatches
              playerId={player.profile.account_id.toString()}
              onRefresh={async () =>
                await handleFetchPlayerData(
                  player.profile.account_id.toString()
                )
              }
              recentMatches={recentMatches}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      //alignItems: "center",
      //justifyContent: "center",
      backgroundColor: colors.standard,
    },
    inputContainer: {
      flex: 1,
      width: "100%",
      alignItems: "center",
    },
    background: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: 150,
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

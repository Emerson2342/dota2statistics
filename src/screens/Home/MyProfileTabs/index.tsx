import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from "@src/context/useThemeContext";
import { useSettingsContext } from "@src/context/useSettingsContext";
import { usePlayerContext } from "@src/context/usePlayerContex";
import { ThemeColor } from "@src/services/props";
import { ProfileHeader } from "./ProfileHeader";
import { LastMatches } from "./LastMatches";
import { ActivityIndicatorCustom } from "@src/utils/ActivityIndicatorCustom";
import { toSteam32 } from "@src/utils/steam";
import { SearchComponent } from "@src/utils/SearchComponent";
import { getErro404Message } from "@src/utils/textMessage";
import { TextComponent } from "@src/components/TextComponent";
import { useFocusEffect } from "expo-router";

type Props = {
  index: number;
};

export function MyProfileTabs({ index }: Props) {
  const { ColorTheme } = useTheme();
  const {
    player,
    heroesPlayedId,
    recentMatches,
    isLoadingContext,
    handleFetchPlayerData,
  } = usePlayerContext();
  const { englishLanguage } = useSettingsContext();
  const [showModalMessage, setShowModalMessage] = useState(false);
  // const opacity = useRef(new Animated.Value(0.3)).current;

  // useEffect(() => {
  //   if (index == 1) {
  //     opacity.setValue(0.3);
  //     Animated.timing(opacity, {
  //       toValue: 1,
  //       duration: 1500,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  // }, [index]);

  const erro404 = getErro404Message(englishLanguage);
  const styles = createStyles(ColorTheme);

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
              : "Carrgando detalhes do jogador..."
          }
        />
      </View>
    );

  if (player == null || player.profile.account_id == 0) {
    return renderSetSteamId();
  }

  return (
    <Animated.View style={styles.container}>
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
    </Animated.View>
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

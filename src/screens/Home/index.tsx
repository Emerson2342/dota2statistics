import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  LayoutAnimation,
  ScrollView,
} from "react-native";
import { createStyles } from "./indexStyles";
import { PLAYER_PROFILE_API_BASE_URL } from "../../constants/player";
import { useSettingsContext } from "../../context/useSettingsContext";
import { ProfileHeader } from "./ProfileHeader";
import { useProfileContext } from "../../context/useProfileContext";
import { usePlayerContext } from "../../context/usePlayerContex";
import { ProMatches } from "./ProMatches";
import { useTheme } from "../../context/useThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { useTimestampContext } from "../../context/useTimestampContext";
import { useRefreshContext } from "../../context/useRefreshContext";
import {
  getHeroesPlayed,
  getProMatches,
  getRecentMatches,
  getSearchPlayer,
} from "../../../src/API";
import { LastMatches } from "./LastMatches";
import { HeroesPlayed, RecentMatches } from "../../../src/services/props";
import { AsyncStorageService } from "../../../src/services/StorageService";

export function Profile() {
  const { profile } = useProfileContext();
  const { ColorTheme } = useTheme();
  const { playerTimestamp, setPlayerTimestamp } = useTimestampContext();
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const {
    player,
    setPlayer,
    heroesPlayedId,
    setHeroesPlayedId,
    setProMatches,
  } = usePlayerContext();
  const { englishLanguage } = useSettingsContext();

  const { refreshProfile, setRefreshProfile } = useRefreshContext();

  const [isLoading, setIsLoading] = useState(true);

  //alert(currentTimestamp);

  const [httpStatus, setHttpStatus] = useState<number>(200);
  const [proMatchesOpen, setProMatchesOpen] = useState(false);

  const [recentMatches, setRecentMatches] = useState<RecentMatches[] | []>([]);
  const [heroesPlayed, setHeroesPlayed] = useState<HeroesPlayed[] | []>([]);

  const styles = createStyles(ColorTheme);

  const handleProMatches = (isExitingApp: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setProMatchesOpen(isExitingApp ? false : !proMatchesOpen);
  };

  const erro404 = englishLanguage
    ? "Please, make sure the Steam Id is correct and the profile is set to public!"
    : "Por favor, certifique-se de que o Id da Steam esteja correto e que o perfil esteja com visibilidade para o público!";

  const erro500 = englishLanguage
    ? "Internal server error. Please, try again later"
    : "Erro interno no servidor. Por favor, tente mais tarde";

  const handleLoadData = async () => {
    setIsLoading(true);

    setTimeout(async () => {
      await getProMatches(setProMatches);
      const searchPlayer = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}`;
      await getSearchPlayer(searchPlayer, setPlayer);

      const recentMatchesUrl = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}/recentMatches`;

      await getRecentMatches(
        recentMatchesUrl,
        setRecentMatches,
        setHeroesPlayedId
      );

      const heroesPlayer = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}/heroes`;

      const heroesPlayedResponse = await getHeroesPlayed(heroesPlayer);
      if (heroesPlayedResponse) setHeroesPlayed(heroesPlayedResponse);

      //console.log(JSON.stringify(heroesPlayedResponse, null, 2));

      setIsLoading(false);
      // setRefreshProfile(false);
    }, 500);
  };

  // alert(JSON.stringify(profile, null, 2))

  // useEffect(() => {
  //   const loadRecentMatches = async () => {
  //     try {
  //       const storedRecentMatches = await storage.getItem<RecentMatches[]>(
  //         "recentMatches"
  //       );
  //       if (storedRecentMatches) {
  //         setRecentMatches(storedRecentMatches);
  //       }
  //     } catch (error) {
  //       console.error("Erro ao carregar dados do AsyncStorage:", error);
  //     } finally {
  //       setLoadedList(true);
  //     }
  //   };

  //   loadRecentMatches();
  // }, []);

  // useEffect(() => {
  //   if (loadedList) {
  //     const saveRecentMatches = async () => {
  //       try {
  //         await storage.setItem("recentMatches", recentMatches);
  //       } catch (error) {
  //         console.error("Erro ao salvar dados no AsyncStorage:", error);
  //       }
  //     };

  //     saveRecentMatches();
  //   }
  // }, [recentMatches, loadedList]);

  // useEffect(
  //   useCallback(() => {
  //     handleLoadData();
  //   }, [])
  // );

  useEffect(() => {
    console.log("******************************");
    handleLoadData();
  }, [profile]);

  // useEffect(() => {
  //   console.log(profile);
  //   if (refreshProfile) {
  //     console.log("Entrou useEffect");
  //     handleLoadData();
  //   }
  //   setIsLoading(false);
  // }, [profile, refreshProfile]);

  if (player == null || (player?.profile.account_id == 0 && !isLoading)) {
    return (
      <View style={styles.erroMessage}>
        <Text style={styles.textErro}>
          {httpStatus > 450 ? erro500 : erro404}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: proMatchesOpen ? 0.35 : 0.82,
            }}
          >
            <ActivityIndicator color={ColorTheme.dark} />
            <Text style={styles.textLoading}>
              {englishLanguage ? "Loading..." : "Carregando..."}
            </Text>
          </View>
        ) : (
          <>
            <View style={{ flex: 0.35 }}>
              <ProfileHeader
                player={player}
                heroesId={heroesPlayedId}
                recentMatches={recentMatches}
              />
            </View>
            <View style={{ flex: proMatchesOpen ? 0 : 0.47 }}>
              <View style={{ flex: 1, paddingBottom: "1%" }}>
                <LastMatches
                  playerId={player.profile.account_id.toString()}
                  onRefresh={() => handleLoadData()}
                  recentMatches={recentMatches}
                />
              </View>
            </View>
          </>
        )}
        <View style={{ flex: proMatchesOpen ? 0.65 : 0.18 }}>
          <ProMatches
            onClick={() => handleProMatches(false)}
            proMatchesOpen={proMatchesOpen}
          />
        </View>
      </View>
    </View>
  );
}

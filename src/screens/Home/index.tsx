import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  LayoutAnimation,
  Pressable,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
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
  getProMatches,
  getRecentMatches,
  getSearchPlayer,
} from "../../../src/API";
import { LastMatches } from "./LastMatches";
import { BannerAds } from "../../../src/components/BannerAds";

export function Profile() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const { profile } = useProfileContext();
  const { ColorTheme } = useTheme();
  const { playerTimestamp, setPlayerTimestamp } = useTimestampContext();
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const {
    player,
    setPlayer,
    recentMatches,
    setRecentMatches,
    heroesPlayedId,
    setHeroesPlayedId,
    proMatches,
    setProMatches,
  } = usePlayerContext();
  const { englishLanguage } = useSettingsContext();

  const { refreshProfile, setRefreshProfile } = useRefreshContext();

  const [isLoading, setIsLoading] = useState(false);

  const [httpStatus, setHttpStatus] = useState<number>(200);
  const [proMatchesOpen, setProMatchesOpen] = useState(false);
  const styles = createStyles(ColorTheme);

  const openProMatches = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setProMatchesOpen(!proMatchesOpen);
  };

  const erro404 = englishLanguage
    ? "Please, make sure the Steam Id is correct and the profile is set to public!"
    : "Por favor, certifique-se de que o Id da Steam esteja correto e que o perfil esteja com visibilidade para o público!";

  const erro500 = englishLanguage
    ? "Internal server error. Please, try again later"
    : "Erro interno no servidor. Por favor, tente mais tarde";

  const handleLoadData = async () => {
    const connectionInfo = await NetInfo.fetch();
    setIsConnected(connectionInfo.isConnected);
    console.log("Conetado? " + isConnected);

    setPlayerTimestamp(currentTimestamp);
    setIsLoading(true);
    setTimeout(async () => {
      await getProMatches(setProMatches);
      const searchPlayer = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}`;
      await getSearchPlayer(searchPlayer, setPlayer);
      //alert("Trouxe dados do endpoint - " + playerTimestamp);

      const recentMatchesUrl = `${PLAYER_PROFILE_API_BASE_URL}${profile?.id_Steam}/recentMatches`;
      await getRecentMatches(
        recentMatchesUrl,
        setRecentMatches,
        setHeroesPlayedId
      );
      setIsLoading(false);
      setRefreshProfile(false);
    }, 500);
  };
  // alert(JSON.stringify(profile, null, 2))

  useFocusEffect(
    useCallback(() => {
      if (
        (playerTimestamp == null || playerTimestamp + 300 < currentTimestamp) &&
        !refreshProfile
      ) {
        handleLoadData();
      }
    }, [playerTimestamp, profile])
  );

  useEffect(() => {
    console.log(profile);
    if (refreshProfile) {
      console.log("Entrou useEffect");
      handleLoadData();
    }
  }, [profile, refreshProfile]);

  //alert(JSON.stringify(profile, null, 2))

  if (isLoading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: "center" }}
        size="large"
        color={ColorTheme.semidark}
      />
    );
  }

  //alert(JSON.stringify(player, null, 2))
  if (player == null || (player?.profile.account_id == 0 && !isLoading)) {
    return (
      <View style={styles.erroMessage}>
        <Text style={styles.textErro}>
          {httpStatus > 450 ? erro500 : erro404}
        </Text>
      </View>
    );
  }

  if (isConnected == false) {
    return (
      <View style={styles.erroMessage}>
        <Text style={styles.textErro}>
          {englishLanguage
            ? "Please, verify your connection!"
            : "Por favor, verifique sua conexão!"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, overflow: "hidden" }}>
        <View style={{ flex: 0.35 }}>
          <ProfileHeader
            player={player}
            heroesId={heroesPlayedId}
            recentMatches={recentMatches}
          />
        </View>
        <View style={{ flex: proMatchesOpen ? 0 : 0.5 }}>
          <View style={{ flex: 1, paddingBottom: "1%" }}>
            <LastMatches
              playerId={player.profile.account_id.toString()}
              onRefresh={() => handleLoadData()}
              recentMatches={recentMatches}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => openProMatches()}
          style={{ flex: proMatchesOpen ? 0.6 : 0.15 }}
        >
          <ProMatches proMatchesOpen={proMatchesOpen} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  LayoutAnimation,
  BackHandler,
  Modal,
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
import {
  useFocusEffect,
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import { useTimestampContext } from "../../context/useTimestampContext";
import { useRefreshContext } from "../../context/useRefreshContext";
import {
  getProMatches,
  getRecentMatches,
  getSearchPlayer,
} from "../../../src/API";
import { LastMatches } from "./LastMatches";
import { ModalExitApp } from "../../../src/components/Modals/ModalExitApp";
import { BottomNavigationProps } from "react-native-paper";

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
    setProMatches,
  } = usePlayerContext();
  const { englishLanguage } = useSettingsContext();

  const { refreshProfile, setRefreshProfile } = useRefreshContext();

  const [isLoading, setIsLoading] = useState(true);
  const [modalExitApp, setModalExitApp] = useState(false);

  const [httpStatus, setHttpStatus] = useState<number>(200);
  const [proMatchesOpen, setProMatchesOpen] = useState(false);
  const styles = createStyles(ColorTheme);

  const navigation = useNavigation();
  const tabIndex = useNavigationState((state) => state?.index ?? 0);

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
    const connectionInfo = await NetInfo.fetch();
    setIsConnected(connectionInfo.isConnected);
    console.log("Conetado? " + isConnected);

    setPlayerTimestamp(currentTimestamp);
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

  const state = navigation.getState();
  const isStack = state?.routes && state?.routes?.length > 1; // Verifica se há mais de uma tela no histórico
  const canGoBack = navigation.canGoBack();
  // alert(JSON.stringify(profile, null, 2))

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // if (proMatchesOpen) {
        //   handleProMatches(true);
        //   //alert("Entrou para fechar promatches");
        //   return true;
        // }

        if (isStack && canGoBack) {
          navigation.goBack();
          return true;
        } else {
          if (tabIndex === 0) {
            setModalExitApp(true);
            //alert("Entrou route Home");
            return true;
          } else {
            navigation.goBack();
            //alert("Entrou no else");
            return true;
          }
        }
      }
    );
    return () => backHandler.remove();
  }, [proMatchesOpen, tabIndex]);

  useFocusEffect(
    useCallback(() => {
      if (
        (playerTimestamp == null || playerTimestamp + 300 < currentTimestamp) &&
        !refreshProfile
      ) {
        handleLoadData();
      }
      setIsLoading(false);
    }, [playerTimestamp, profile])
  );

  useEffect(() => {
    console.log(profile);
    if (refreshProfile) {
      console.log("Entrou useEffect");
      handleLoadData();
    }
    setIsLoading(false);
  }, [profile, refreshProfile]);

  //alert(JSON.stringify(profile, null, 2))

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
      <Modal
        visible={modalExitApp}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <ModalExitApp
          isVisible={modalExitApp}
          handleClose={() => setModalExitApp(false)}
          handleExitApp={() => BackHandler.exitApp()}
        />
      </Modal>
    </View>
  );
}

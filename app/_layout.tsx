import { Stack, useLocalSearchParams } from "expo-router";
import { PlayerProvider } from "./../src/context/usePlayerContex";
import {
  SettingsProvider,
  useSettingsContext,
} from "./../src/context/useSettingsContext";
import { ProfileProvider } from "./../src/context/useProfileContext";
import { ThemeProvider, useTheme } from "./../src/context/useThemeContext";
import { TeamsListProvider } from "./../src/context/useTeamContext";
import mobileAds from "react-native-google-mobile-ads";
import { useFonts } from "expo-font";
import { PaperProvider } from "react-native-paper";
import { FavoritesProvider } from "./../src/context/useFavoritesContext";
import {
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SplashScreenComponent } from "./../src/screens/SplashScreenComponent";
import Constants from "expo-constants";
import VersionCheck from "react-native-version-check";
import { ModalHasUpdate } from "./../src/components/Modals/ModalHasUpdate";
import { FontAwesome } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Teste from "../gestureHandler";

SplashScreen.preventAutoHideAsync();

export default function App() {
  mobileAds()
    .initialize()
    .then((adapterStatuses) => {
      // Initialization complete!
    });

  const [fontsLoaded] = useFonts({
    "QuickSand-Regular": require("./../src/Fonts/Quicksand_Regular.ttf"),
    "QuickSand-Semibold": require("./../src/Fonts/Quicksand_SemiBold.ttf"),
    "QuickSand-Bold": require("./../src/Fonts/Quicksand_Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <SettingsProvider>
        <ThemeProvider>
          <PlayerProvider>
            <ProfileProvider>
              <TeamsListProvider>
                <PaperProvider>
                  <FavoritesProvider>
                    {/* <Teste /> */}
                    <Content />
                  </FavoritesProvider>
                </PaperProvider>
              </TeamsListProvider>
            </ProfileProvider>
          </PlayerProvider>
        </ThemeProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}

function Content() {
  const { ColorTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const { englishLanguage } = useSettingsContext();

  useEffect(() => {
    checkForUpdates();
  }, []);

  function isNewerVersion(latest: string, current: string) {
    const latestParts = latest.split(".").map(Number);
    const currentParts = current.split(".").map(Number);

    for (
      let i = 0;
      i < Math.max(latestParts.length, currentParts.length);
      i++
    ) {
      const latestNum = latestParts[i] || 0;
      const currentNum = currentParts[i] || 0;

      if (latestNum > currentNum) return true;
      if (latestNum < currentNum) return false;
    }
    return false;
  }

  async function checkForUpdates() {
    try {
      const androidPackageName = Constants.expoConfig?.android?.package;
      if (!androidPackageName) return;

      const currentVersion = Constants.expoConfig?.version;
      if (!currentVersion) return;

      const latestVersion = await VersionCheck.getLatestVersion({
        provider: Platform.OS === "android" ? "playStore" : "appStore",
        packageName: Platform.OS === "android" ? androidPackageName : "",
      });
      const hasUpdate = isNewerVersion(latestVersion, currentVersion);

      if (hasUpdate) {
        setModalVisible(true);
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={ColorTheme.dark} />
      <Modal visible={modalVisible} transparent>
        <ModalHasUpdate handleClose={() => setModalVisible(false)} />
      </Modal>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="match-details"
          options={{
            headerShown: true,
            title: englishLanguage ? "Match Details" : "Detalhes da Partida",
            headerStyle: {
              backgroundColor: ColorTheme.dark,
            },
            headerTitleStyle: {
              fontFamily: "QuickSand-Semibold",
              fontSize: 20,
            },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="league-matches"
          options={{
            headerShown: true,
            title: englishLanguage ? "League Matches" : "Jogos do Campeonato",
            headerStyle: {
              backgroundColor: ColorTheme.dark,
            },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: "QuickSand-Semibold",
              fontSize: 20,
            },
          }}
        />
        <Stack.Screen
          name="hero-details"
          options={{
            headerShown: true,
            title: englishLanguage ? "Hero Details" : "Detalhes do Herói",
            headerStyle: {
              backgroundColor: ColorTheme.dark,
            },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: "QuickSand-Semibold",
              fontSize: 20,
            },
          }}
        />
      </Stack>
    </View>
  );
}

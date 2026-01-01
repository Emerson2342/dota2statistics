import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import mobileAds from "react-native-google-mobile-ads";
import { useFonts } from "expo-font";
import { Modal, Platform, StatusBar, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";
import { ModalHasUpdate } from "@src/components/Modals/ModalHasUpdate";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import VersionCheck from "react-native-version-check";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";

SplashScreen.preventAutoHideAsync();

export default function App() {
  mobileAds()
    .initialize()
    .then((adapterStatuses) => {
      // Initialization complete!
    });
  const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        {/* <Teste /> */}
        <Content />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function Content() {
  const { globalTheme } = useSettingsStore.getState();
  const colorTheme = useThemeStore((state) => state.colorTheme);

  const { englishLanguage } = useSettingsStore();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    checkForUpdates();
    useThemeStore.getState().setTheme(globalTheme);

    const unsubscribe = useSettingsStore.subscribe((state, prevState) => {
      if (state.globalTheme !== prevState.globalTheme) {
        useThemeStore.getState().setTheme(state.globalTheme);
      }
    });
    return unsubscribe;
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
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <StatusBar backgroundColor={colorTheme.dark} barStyle={"light-content"} />
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
              backgroundColor: colorTheme.dark,
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
          name="team-fights"
          options={{
            headerShown: true,
            title: "Team Fights",
            headerStyle: {
              backgroundColor: colorTheme.dark,
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
              backgroundColor: colorTheme.dark,
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
              backgroundColor: colorTheme.dark,
            },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="player-profile"
          options={{
            headerShown: true,
            title: englishLanguage ? "Profile Player" : "Perfil do Jogador",
            headerStyle: {
              backgroundColor: colorTheme.dark,
            },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}

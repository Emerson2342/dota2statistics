import { Stack } from "expo-router";
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
import { Modal, Platform, StatusBar, StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SplashScreenComponent } from "./../src/screens/SplashScreenComponent";
import Constants from "expo-constants";
import VersionCheck from "react-native-version-check";
import { ModalHasUpdate } from "./../src/components/Modals/ModalHasUpdate";

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
    <SettingsProvider>
      <ThemeProvider>
        <PlayerProvider>
          <ProfileProvider>
            <TeamsListProvider>
              <PaperProvider>
                <FavoritesProvider>
                  <Content />
                </FavoritesProvider>
              </PaperProvider>
            </TeamsListProvider>
          </ProfileProvider>
        </PlayerProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}

function Content() {
  const { ColorTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const { englishLanguage } = useSettingsContext();

  const [isAppAlready, setIsAppAlready] = useState(false);

  useEffect(() => {
    checkForUpdates();
  }, []);

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
      const hasUpdate = latestVersion > currentVersion;

      if (hasUpdate) {
        setModalVisible(true);
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  if (!isAppAlready) {
    return (
      <SplashScreenComponent
        onFinish={(isCancelled) => !isCancelled && setIsAppAlready(true)}
      />
    );
  }

  if (!isAppAlready)
    return <SplashScreenComponent onFinish={() => setIsAppAlready(true)} />;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={ColorTheme.dark} />
      <Modal visible={modalVisible} transparent>
        <ModalHasUpdate handleClose={() => setModalVisible(false)} />
      </Modal>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: ColorTheme.dark },
          headerTintColor: "#fff",
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
      </Stack>
    </View>
  );
}

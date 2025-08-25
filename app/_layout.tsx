import { Stack } from "expo-router";
import { PlayerProvider } from "./../src/context/usePlayerContex";
import { SettingsProvider } from "./../src/context/useSettingsContext";
import { Routes } from "./../src/routes/routes";
import { NavigationContainer } from "@react-navigation/native";
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
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

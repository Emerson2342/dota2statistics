import "react-native-reanimated";
import "react-native-gesture-handler";
import "expo-dev-client";
import { PlayerProvider } from "./src/context/usePlayerContex";
import { SettingsProvider } from "./src/context/useSettingsContext";
import { Routes } from "./src/routes/routes";
import { NavigationContainer } from "@react-navigation/native";
import { ProfileProvider } from "./src/context/useProfileContext";
import { ThemeProvider } from "./src/context/useThemeContext";
import { TeamsListProvider } from "./src/context/useTeamContext";
import mobileAds from "react-native-google-mobile-ads";
import { useFonts } from "expo-font";
import { PaperProvider } from "react-native-paper";
import { FavoritesProvider } from "./src/context/useFavoritesContext";
import { View, Text, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SplashScreenComponent } from "./src/screens/SplashScreenComponent";

export default function App() {
  const [isAppAlready, setIsAppAlready] = useState(false);

  SplashScreen.preventAutoHideAsync();
  mobileAds()
    .initialize()
    .then((adapterStatuses) => {
      // Initialization complete!
    });

  const [fontsLoaded] = useFonts({
    "QuickSand-Regular": require("./src/Fonts/Quicksand_Regular.ttf"),
    "QuickSand-Semibold": require("./src/Fonts/Quicksand_SemiBold.ttf"),
    "QuickSand-Bold": require("./src/Fonts/Quicksand_Bold.ttf"),
  });

  return (
    <NavigationContainer>
      <SettingsProvider>
        <ThemeProvider>
          <PlayerProvider>
            <ProfileProvider>
              <TeamsListProvider>
                <PaperProvider>
                  <FavoritesProvider>
                    <Routes />
                  </FavoritesProvider>
                </PaperProvider>
              </TeamsListProvider>
            </ProfileProvider>
          </PlayerProvider>
        </ThemeProvider>
      </SettingsProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  betaTag: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "red",
    paddingHorizontal: "3%",
    borderRadius: 7,
    zIndex: 999,
  },
  betaText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
  },
});

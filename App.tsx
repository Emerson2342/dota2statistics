import "react-native-reanimated";
import "react-native-gesture-handler";
import "expo-dev-client";
import { StatusBar } from "react-native";
import { PlayerProvider } from "./src/context/usePlayerContex";
import { SettingsProvider } from "./src/context/useSettingsContext";
import { Routes } from "./src/routes/routes";
import { NavigationContainer } from "@react-navigation/native";
import { ProfileProvider } from "./src/context/useProfileContext";
import { ThemeProvider } from "./src/context/useThemeContext";
import { TeamsListProvider } from "./src/context/useTeamContext";
import { TimestampProvider } from "./src/context/useTimestampContext";
import mobileAds from "react-native-google-mobile-ads";
import { useFonts } from "expo-font";
import { PaperProvider } from 'react-native-paper';
import { FavoritesProvider } from "./src/context/useFavoritesContext";
import { RefreshProvider } from "./src/context/useRefreshContext";
import { MactchesDetailsListProvider } from "./src/context/useMatchesDetailsListContext";

export default function App() {
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
        <MactchesDetailsListProvider>
        <ThemeProvider>
          <PlayerProvider>
            <ProfileProvider>
              <TeamsListProvider>
                <RefreshProvider>
                  <TimestampProvider>
                    <PaperProvider>
                      <FavoritesProvider>
                        <Routes />
                      </FavoritesProvider>
                    </PaperProvider>
                  </TimestampProvider>
                </RefreshProvider>
              </TeamsListProvider>
            </ProfileProvider>
          </PlayerProvider>
        </ThemeProvider>
        </MactchesDetailsListProvider>
      </SettingsProvider>
    </NavigationContainer>
  );
}

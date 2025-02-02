import "react-native-reanimated";
import "react-native-gesture-handler";
import "expo-dev-client";
import { StatusBar } from "react-native";
import { PlayerProvider } from "./src/context/usePlayerContex";
import { KeyCounterProvider } from "./src/context/useKeyCounter";
import { FriendsListProvider } from "./src/context/useFriendsListContext";
import { SettingsProvider } from "./src/context/useSettingsContext";
import { Routes } from "./src/routes/routes";
import { NavigationContainer } from "@react-navigation/native";
import { ProfileProvider } from "./src/context/useProfileContext";
import { MactchesDetailsListProvider } from "./src/context/useMatchesDetailsListContext";
import { ThemeProvider } from "./src/context/useThemeContext";
import { TeamsListProvider } from "./src/context/useTeamContext";
import { TimestampProvider } from "./src/context/useTimestampContext";
import { LeagueListProvider } from "./src/context/useLeaguesListContext";
import { RefreshProvider } from "./src/context/useRefreshContext";
import mobileAds from "react-native-google-mobile-ads";
import { useFonts } from "expo-font";
import { HeroItemListProvider } from "./src/context/useHeroItemsListContext";
import { PaperProvider } from 'react-native-paper';
import { FavoritesProvider } from "./src/context/useFavoritesContext";

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
        <ThemeProvider>
          <KeyCounterProvider>
            <PlayerProvider>
              <FriendsListProvider>
                <ProfileProvider>
                  <MactchesDetailsListProvider>
                    <TeamsListProvider>
                      <TimestampProvider>
                        <LeagueListProvider>
                          <RefreshProvider>
                            <HeroItemListProvider>
                              <PaperProvider>
                                <FavoritesProvider>
                                  <Routes />
                                </FavoritesProvider>
                              </PaperProvider>
                            </HeroItemListProvider>
                          </RefreshProvider>
                        </LeagueListProvider>
                      </TimestampProvider>
                    </TeamsListProvider>
                  </MactchesDetailsListProvider>
                </ProfileProvider>
              </FriendsListProvider>
            </PlayerProvider>
          </KeyCounterProvider>
        </ThemeProvider>
      </SettingsProvider>
    </NavigationContainer>
  );
}

import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { MatchDetails } from "../../screens/MatchDetails/MatchDetails";
import { RootStackParamList } from "../../services/props";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { LeagueDetails } from "../../screens/LeagueMatches/LeagueMatches";
import { BottomTabsNavigator } from "../BottomTabsNavigator";
import { PlayerProfile } from "../../../src/screens/PlayerProfile";
import { HeroDetailsScreen } from "../../../src/screens/HeroDetails";
import { DrawerNavigatorScreen } from "../DrawerNavigator";

const Stack = createStackNavigator<RootStackParamList>();

export function StackNavigator() {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigatorScreen}
        options={{
          headerShown: false,
          title: englishLanguage ? "Home" : "Principal",
          headerStyle: {
            backgroundColor: ColorTheme.dark,
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "QuickSand-Semibold",
            fontSize: 20,
            textAlign: "center",
          },
        }}
      />
      <Stack.Screen
        name="MatchDetails"
        component={MatchDetails}
        options={{
          title: englishLanguage ? "Match Details" : "Detalhes da Partida",
          headerStyle: {
            backgroundColor: ColorTheme.dark,
          },
          headerTitleStyle: {
            fontFamily: "QuickSand-Semibold",
            fontSize: 20,
            textAlign: "center",
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="LeagueDetails"
        component={LeagueDetails}
        options={{
          title: englishLanguage ? "League Details" : "Detalhes do Campeonato",
          headerStyle: {
            backgroundColor: ColorTheme.dark,
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "QuickSand-Semibold",
            fontSize: 20,
            textAlign: "center",
          },
        }}
      />
      <Stack.Screen
        name="PlayerProfile"
        component={PlayerProfile}
        options={{
          title: englishLanguage ? "Profile Player" : "Perfil do Jogador",
          headerStyle: {
            backgroundColor: ColorTheme.dark,
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "QuickSand-Semibold",
            fontSize: 20,
            textAlign: "center",
          },
        }}
      />
      <Stack.Screen
        name="HeroDetails"
        component={HeroDetailsScreen}
        options={{
          title: englishLanguage ? "Hero Details" : "Detalhes do Herói",
          headerStyle: {
            backgroundColor: ColorTheme.dark,
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "QuickSand-Semibold",
            fontSize: 20,
            textAlign: "center",
          },
        }}
      />
    </Stack.Navigator>
  );
}

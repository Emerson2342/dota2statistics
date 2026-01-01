import * as React from "react";
import { Dimensions } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { Home } from "@src/screens/Home";
import { Search } from "@src/screens/Search";
import { Favorites } from "@src/screens/Favorites";
import { Leagues } from "@src/screens/Leagues/Leagues";
import { ListaDeHerois } from "@src/screens/HeroesList";
import { SettingsScreen } from "@src/screens/Settings/SettingsScreen";
import { CustomDrawerContent } from "./customDrawer";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsStore } from "@src/store/settings";
import { useThemeStore } from "@src/store/theme";
const Drawer = createDrawerNavigator();
const width = Dimensions.get("window").width;

export function DrawerNavigatorScreen() {
  const { englishLanguage } = useSettingsStore();
  const colorTheme = useThemeStore((state) => state.colorTheme);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colorTheme.dark,
        },
        headerTitleAlign: "center",
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontFamily: "QuickSand-Semibold",
          width: width * 0.7,
          textAlign: "center",
        },
        drawerActiveTintColor: colorTheme.semidark,
        drawerActiveBackgroundColor: colorTheme.light,
        drawerInactiveTintColor: colorTheme.semilight,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          title: englishLanguage ? "Home" : "Principal",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="HeroesList"
        component={ListaDeHerois}
        options={{
          title: englishLanguage ? "Heroes List" : "Lista de Heróis",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Search"
        component={Search}
        options={{
          title: englishLanguage ? "Search" : "Pesquisar",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Favorites"
        component={Favorites}
        options={{
          title: englishLanguage ? "Favorites" : "Favoritos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Tournament"
        component={Leagues}
        options={{
          title: englishLanguage ? "Tournament" : "Campeonatos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: englishLanguage ? "Settings" : "Configurações",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

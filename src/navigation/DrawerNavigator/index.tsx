import * as React from "react";
import { Dimensions } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTheme } from "@src/context/useThemeContext";

import { Home } from "@src/screens/Home";
import { Search } from "@src/screens/Search";
import { Favorites } from "@src/screens/Favorites";
import { Leagues } from "@src/screens/Leagues/Leagues";
import { ListaDeHerois } from "@src/screens/HeroesList";
import { SettingsScreen } from "@src/screens/Settings/SettingsScreen";
import { CustomDrawerContent } from "./customDrawer";
import { Ionicons } from "@expo/vector-icons";
import { SantaHatComponent } from "@src/components/SantaHatComponent";
import { useSettingsStore } from "@src/store/settings";
const Drawer = createDrawerNavigator();
const width = Dimensions.get("window").width;

export function DrawerNavigatorScreen() {
  const { englishLanguage } = useSettingsStore();
  const { ColorTheme } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: ColorTheme.dark,
        },
        headerTitleAlign: "center",
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontFamily: "QuickSand-Semibold",
          width: width * 0.7,
          textAlign: "center",
        },
        drawerActiveTintColor: ColorTheme.semidark,
        drawerActiveBackgroundColor: ColorTheme.light,
        drawerInactiveTintColor: ColorTheme.semilight,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: () => (
            <SantaHatComponent englishName="Home" portugueseName="Principal" />
          ),
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
          headerTitle: () => (
            <SantaHatComponent
              englishName="Heroes List"
              portugueseName="Lista de Heróis"
            />
          ),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Search"
        component={Search}
        options={{
          headerTitle: () => (
            <SantaHatComponent
              englishName="Search"
              portugueseName="Pesquisar"
            />
          ),
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
          headerTitle: () => (
            <SantaHatComponent
              englishName="Favorites"
              portugueseName="Favoritos"
            />
          ),
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
          headerTitle: () => (
            <SantaHatComponent
              englishName="Tournament"
              portugueseName="Campeonatos"
            />
          ),
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
          headerTitle: () => (
            <SantaHatComponent
              englishName="Settings"
              portugueseName="Configurações"
            />
          ),

          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

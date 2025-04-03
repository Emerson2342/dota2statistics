import * as React from "react";
import {
  Dimensions,
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";

import { Profile } from "../../../src/screens/Home";
import { Search } from "../../../src/screens/Search";
import { Favorites } from "../../../src/screens/Favorites";
import { Leagues } from "../../../src/screens/Leagues/Leagues";
import { ListaDeHerois } from "../../../src/screens/HeroesList";
import { SettingsScreen } from "../../../src/screens/Settings/SettingsScreen";
import { usePlayerContext } from "../../../src/context/usePlayerContex";
import { CustomDrawerContent } from "./customDrawer";

const Drawer = createDrawerNavigator();
const width = Dimensions.get("window").width;

export function DrawerNavigator() {
  const { englishLanguage } = useSettingsContext();
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
        component={Profile}
        options={{
          title: englishLanguage ? "Home" : "Principal",
        }}
      />
      <Drawer.Screen
        name="HeroesList"
        component={ListaDeHerois}
        options={{
          title: englishLanguage ? "Heroes" : "Heróis",
        }}
      />
      <Drawer.Screen
        name="Search"
        component={Search}
        options={{
          title: englishLanguage ? "Search" : "Pesquisar",
        }}
      />
      <Drawer.Screen
        name="Favorites"
        component={Favorites}
        options={{
          title: englishLanguage ? "Favorites" : "Favoritos",
        }}
      />
      <Drawer.Screen
        name="Tournament"
        component={Leagues}
        options={{
          title: englishLanguage ? "Tournament" : "Campeonatos",
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: englishLanguage ? "Settings" : "Configurações",
        }}
      />
    </Drawer.Navigator>
  );
}

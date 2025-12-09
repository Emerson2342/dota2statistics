import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { ListaDeHerois } from "../../../src/screens/HeroesList";
import { Leagues } from "../../../src/screens/Leagues/Leagues";
import { Dimensions, StyleSheet } from "react-native";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Favorites } from "../../../src/screens/Favorites";
import { Search } from "../../../src/screens/Search";
import { Home } from "../../../src/screens/Home";

const Tab = createBottomTabNavigator();
const width = Dimensions.get("window").width;
export function BottomTabsNavigator() {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();

  return (
    <Tab.Navigator
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
        tabBarLabelStyle: {
          fontFamily: "QuickSand-Bold",
          color: ColorTheme.semidark,
        },
        tabBarActiveTintColor: ColorTheme.semidark,
        tabBarInactiveTintColor: ColorTheme.semidark,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: englishLanguage ? "My Profile" : "Meu Perfil",
          tabBarLabel: englishLanguage ? "My Profile" : "Meu Perfil",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons
                size={25}
                color={color}
                name={focused ? "person" : "person-outline"}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          headerTitle: englishLanguage ? "Search" : "Pesquisar",
          tabBarLabel: englishLanguage ? "Search" : "Pesquisar",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons
                size={25}
                color={color}
                name={focused ? "search" : "search-outline"}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          headerTitle: englishLanguage ? "Favorites" : "Favoritos",
          tabBarLabel: englishLanguage ? "Favorites" : "Favoritos",
          tabBarIcon: ({ focused, color }) => {
            return (
              <FontAwesome
                size={25}
                color={color}
                name={focused ? "star" : "star-o"}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Tournament"
        component={Leagues}
        options={{
          headerTitle: englishLanguage ? "Tournament" : "Campeonatos",
          tabBarLabel: englishLanguage ? "Tournament" : "Campeonatos",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons
                size={25}
                color={color}
                name={focused ? "trophy" : "trophy-outline"}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="HeroesList"
        component={ListaDeHerois}
        options={{
          headerTitle: englishLanguage ? "Heroes" : "Heróis",
          tabBarLabel: englishLanguage ? "Heroes" : "Heróis",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons
                size={25}
                color={color}
                name={focused ? "people" : "people-outline"}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  aboutUsButton: {
    width: "100%",
    marginLeft: 23,
    alignItems: "center",
  },
  helpButton: {
    width: "100%",
    marginRight: 23,
    alignItems: "center",
  },
});

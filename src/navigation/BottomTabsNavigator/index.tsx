import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { Profile } from "../../../src/screens/Home";
import { ListaDeHerois } from "../../../src/screens/HeroesList";
import { Leagues } from "../../../src/screens/Leagues/Leagues";
import { FindPlayer } from "../../../src/screens/FindPlayer";
import {
  Dimensions,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  Text,
} from "react-native";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { ModalSettings } from "../../../src/components/Modals/ModalSettings";
import { Favorites } from "../../../src/screens/Favorites";

const Tab = createBottomTabNavigator();
const width = Dimensions.get("window").width;
export function BottomTabsNavigator() {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const [modalSettingsVisible, setModalSettingsVisible] = useState(false);

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => (
          <View>
            <TouchableOpacity
              onPress={() => setModalSettingsVisible(true)}
              style={styles.helpButton}
            >
              <Ionicons name="settings-outline" color={"#fff"} size={23} />
            </TouchableOpacity>

            <Modal
              statusBarTranslucent={true}
              visible={modalSettingsVisible}
              transparent={true}
              animationType="fade"
            >
              <ModalSettings
                handleClose={() => setModalSettingsVisible(false)}
              />
            </Modal>
          </View>
        ),
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
        component={Profile}
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
        component={FindPlayer}
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

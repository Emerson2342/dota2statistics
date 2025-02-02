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
} from "react-native";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { ModalSettings } from "../../../src/components/Modals/ModalSettings";

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
        // headerShown: false,
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
      }}
    >
      <Tab.Screen
        name="Home"
        component={Profile}
        options={{
          headerTitle: englishLanguage ? "My Profile" : "Meu Perfil",
          tabBarLabel: englishLanguage ? "My Profile" : "Meu Perfil",
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                size={25}
                color={ColorTheme.standard}
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
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                size={25}
                color={ColorTheme.standard}
                name={focused ? "search" : "search-outline"}
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
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                size={25}
                color={ColorTheme.standard}
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
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                size={25}
                color={ColorTheme.semidark}
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
  helpButton: {
    width: "100%",
    marginRight: 23,
    alignItems: "center",
  },
});

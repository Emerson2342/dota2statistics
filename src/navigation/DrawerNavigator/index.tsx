import React from "react";
import { Dimensions, View } from "react-native";

import { styles } from "./styles";
import { useSettingsContext } from "../../context/useSettingsContext";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { Profile } from "../../screens/Home";
import { ListaDeHerois } from "../../screens/HeroesList";
import { SettingsScreen } from "../../screens/Settings/Settings";
import CustomDrawerContent from "../../screens/DrawerItems";
import { Friends } from "../../screens/Friends";
import { useTheme } from "../../context/useThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Leagues } from "../../../src/screens/Leagues/Leagues";
import { useFonts } from "expo-font";
import { BannerAds } from "../../../src/components/BannerAds";
import { FindPlayer } from "../../../src/screens/FindPlayer";

const Drawer = createDrawerNavigator();

export function DrawerNavigator() {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const width = Dimensions.get('window').width;


  const [fontsLoaded] = useFonts({
    "QuickSand-Regular": require("../../Fonts/Quicksand_Regular.ttf"),
    "QuickSand-Semibold": require("../../Fonts/Quicksand_SemiBold.ttf"),
    "QuickSand-Bold": require("../../Fonts/Quicksand_Bold.ttf"),
  });

  return (
    <View style={styles.container}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: ColorTheme.semilight,
          drawerInactiveTintColor: ColorTheme.dark,
          //headerTintColor: 'yellow',
          headerStyle: {
            backgroundColor: ColorTheme.dark,
          },
          drawerStyle: {
            width: "70%",
          },
        }}
      >
        <Drawer.Screen
          name="Profile"
          component={Profile}
          options={{
            drawerLabel: englishLanguage ? "Profile" : "Perfil",
            drawerLabelStyle: {
              fontFamily: "QuickSand-Semibold",
            },
            headerTitle: englishLanguage ? "My Profile" : "Meu Perfil",
            headerTitleStyle: {
              fontFamily: "QuickSand-Semibold",
              width: width * 0.7,
              textAlign: 'center'
            },
            headerTitleAlign: "center",
            headerTintColor: "white",

            drawerIcon: ({ size, color }) => {
              return (
                <Ionicons name="person-outline" size={size} color={color} />
              );
            },
          }}
        />
        {/* <Drawer.Screen
          name="SearchMatchDetails"
          component={MatchDetails}
          options={{
            drawerLabel: englishLanguage ? "Match Details" : "Detalhes da Partida",
            headerTitle: englishLanguage ? "Match Details" : "Detalhes da Partida",
            headerTitleAlign: 'center',
            headerTintColor: ColorTheme.light,
            drawerIcon: ({ size, color }) => {
              return <Ionicons name="person-outline" size={size} color={color} />;
            }
          }}
        /> */}
        <Drawer.Screen
          name="HeroesList"
          component={ListaDeHerois}
          options={{
            title: englishLanguage ? "Heroes" : "Heróis",
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerTitleStyle: {
              fontFamily: "QuickSand-Semibold",
              fontSize: 20,
              width: width * 0.7,
              textAlign: 'center'
            },
            drawerLabelStyle: {
              fontFamily: "QuickSand-Semibold",
            },
            drawerIcon: ({ size, color }) => {
              return (
                <Ionicons
                  name="list-circle-outline"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
        <Drawer.Screen
          name="Leagues"
          component={Leagues}
          options={{
            title: englishLanguage ? "Leagues" : "Campeonatos",
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerTitleStyle: {
              fontFamily: "QuickSand-Semibold",
              fontSize: 20,
              width: width * 0.7,
              textAlign: 'center'
            },
            drawerLabelStyle: {
              fontFamily: "QuickSand-Semibold",
            },
            drawerIcon: ({ size, color }) => {
              return (
                <Ionicons
                  name="list-circle-outline"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
        <Drawer.Screen
          name="SearchPlayer"
          component={FindPlayer}
          options={{
            title: englishLanguage ? "Search Player" : "Procurar Jogador",
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerTitleStyle: {
              fontFamily: "QuickSand-Semibold",
              fontSize: 20,
              width: width * 0.7,
              textAlign: 'center'
            },
            drawerLabelStyle: {
              fontFamily: "QuickSand-Semibold",
            },
            drawerIcon: ({ size, color }) => {
              return (
                <Ionicons
                  name="search-outline"
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
        {/* <Drawer.Screen
          name="FriendsList"
          component={Friends}
          options={{
            title: englishLanguage ? "Friends" : "Amigos",
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerTitleStyle: {
              fontFamily: "QuickSand-Semibold",
              fontSize: 20,
              width: width * 0.7,
              textAlign: 'center'
            },
            drawerLabelStyle: {
              fontFamily: "QuickSand-Semibold",
            },
            drawerIcon: ({ size, color }) => {
              return (
                <Ionicons name="people-outline" size={size} color={color} />
              );
            },
          }}
        /> */}
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: englishLanguage ? "Settings" : "Configurações",
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerTitleStyle: {
              fontFamily: "QuickSand-Semibold",
              fontSize: 20,
              width: width * 0.7,
              textAlign: 'center'
            },
            drawerLabelStyle: {
              fontFamily: "QuickSand-Semibold",
            },
            drawerIcon: ({ size, color }) => {
              return (
                <Ionicons name="settings-outline" size={size} color={color} />
              );
            },
          }}
        />
      </Drawer.Navigator>
      <BannerAds />
    </View>
  );
}

import * as React from "react";
import {
  Dimensions,
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Profile } from "../../../src/screens/Home";
import { Search } from "../../../src/screens/Search";
import { Favorites } from "../../../src/screens/Favorites";
import { Leagues } from "../../../src/screens/Leagues/Leagues";
import { ListaDeHerois } from "../../../src/screens/HeroesList";
import { SettingsScreen } from "../../../src/screens/Settings/SettingsScreen";

const Tab = createDrawerNavigator();
const width = Dimensions.get("window").width;
export function DrawerNavigator() {
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const [modalSettingsVisible, setModalSettingsVisible] = React.useState(false);

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
      }}
    >
      <Tab.Screen
        name="Home"
        component={Profile}
        options={{
          title: englishLanguage ? "My Profile" : "Meu Perfil",
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          title: englishLanguage ? "Search" : "Pesquisar",
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          title: englishLanguage ? "Favorites" : "Favoritos",
        }}
      />
      <Tab.Screen
        name="Tournament"
        component={Leagues}
        options={{
          title: englishLanguage ? "Tournament" : "Campeonatos",
        }}
      />
      <Tab.Screen
        name="HeroesList"
        component={ListaDeHerois}
        options={{
          title: englishLanguage ? "Heroes" : "Heróis",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: englishLanguage ? "Settings" : "Configurações",
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

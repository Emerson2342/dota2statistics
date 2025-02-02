import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { signOut } from "firebase/auth";
import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { auth } from "../../../src/services/firebaseConfig";
import { Feather } from "@expo/vector-icons";
import { usePlayerContext } from "../../context/usePlayerContex";
import { Medal } from "../../../src/components/Medals/MedalsList";
import Constants from "expo-constants";
import { useSettingsContext } from "../../../src/context/useSettingsContext";
import { useProfileContext } from "../../../src/context/useProfileContext";
import { useTheme } from "../../../src/context/useThemeContext";
import { ThemeColor } from "../Home/props";
import { styles } from "../../navigation/DrawerNavigator/styles";
import { useTimestampContext } from "../../../src/context/useTimestampContext";
import { useFonts } from "expo-font";

export default function DrawerItems(props: DrawerContentComponentProps) {
  const { player, setPlayer, setRecentMatches, setHeroesPlayedId } = usePlayerContext();
  const { setProfile } = useProfileContext();
  const { englishLanguage } = useSettingsContext();
  const { ColorTheme } = useTheme();
  const { setPlayerTimestamp } = useTimestampContext();

  const [fontsLoaded] = useFonts({
    "QuickSand-Regular": require("../../Fonts/Quicksand_Regular.ttf"),
    "QuickSand-Semibold": require("../../Fonts/Quicksand_SemiBold.ttf"),
    "QuickSand-Bold": require("../../Fonts/Quicksand_Bold.ttf"),
  });

  const styles = createStyles(ColorTheme);

  const handleSignOut = async () => {
    try {
      setProfile(null);
      setPlayerTimestamp(null);
      setPlayer(null);
      setRecentMatches([]);
      setHeroesPlayedId([]);
      await signOut(auth);
      console.log("Usuário deslogado");
    } catch (error) {
      console.error("Erro ao deslogar o usuário:", error);
    }
  };

  const PlayerDetails = () => {
    return (
      <View style={styles.imageContainer}>
        <Image
          style={{ width: 88, height: 88, borderRadius: 10 }}
          source={{ uri: player?.profile.avatarfull }}
        />
        <View>
          <Text
            style={[styles.textNickname, { fontFamily: "QuickSand-Semibold" }]}
          >
            {player?.profile.personaname}
          </Text>
          <Text
            style={[
              styles.textName,
              { display: player && player.profile.name == null ? "none" : "flex" },
            ]}
          >
            {player?.profile.name}
          </Text>
        </View>
      </View>
    );
  };

  //alert(JSON.stringify(player, null, 2))

  const PlayerNotFound = () => {
    return (
      <View style={styles.imageContainer}>
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 10,
            backgroundColor: "#ccc",
            alignSelf: "center",
            marginTop: "5%",
          }}
        />
        <View style={{ alignItems: "center" }}>
          <Image
            style={{ width: 88, height: 88 }}
            source={{ uri: `${Medal(0)}` }}
          />
        </View>
      </View>
    );
  };

  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        flex: 1,
        paddingTop: 0,
        paddingRight: 0,
        paddingEnd: 0,
        paddingStart: 0,
      }}
    >
      <TouchableOpacity
        style={styles.profileDetails}
        onLongPress={() => alert(JSON.stringify(player, null, 2))}
      >
        {player && player.profile.avatarfull !== "" && player && player.profile ? (
          <PlayerDetails />
        ) : (
          <PlayerNotFound />
        )}
      </TouchableOpacity>
      <DrawerItemList {...props} />
      <View style={{ flex: 1 }}>
        <View style={styles.versionContainer}>
          <TouchableOpacity
            onPress={() => handleSignOut()}
            style={{ flexDirection: "row", padding: "3%" }}
          >
            <Text
              style={{
                fontSize: 15,
                color: ColorTheme.semilight,
                fontFamily: "QuickSand-Semibold",
              }}
            >
              {englishLanguage ? "Logout " : "Sair "}
            </Text>
            <Feather name="log-out" size={20} color={ColorTheme.semilight} />
          </TouchableOpacity>
          <Text style={styles.versionText}>{Constants.expoConfig?.name}</Text>
          <Text style={[styles.versionText, { borderTopWidth: 0 }]}>
            Versão {Constants.expoConfig?.version}
          </Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const createStyles = (colors: ThemeColor) =>
  StyleSheet.create({
    profileDetails: {
      justifyContent: "center",
      alignSelf: "center",
      paddingTop: "10%",
      flex: 0.5,
      width: "100%",
      backgroundColor: colors.semidark,
      borderTopRightRadius: 10,
      marginBottom: "5%",
    },
    imageContainer: {
      width: "100%",
      justifyContent: "space-around",
      paddingTop: "3%",
      alignItems: "center",
    },
    textNickname: {
      color: colors.light,
      textAlign: "center",
      fontSize: 20,
    },
    textName: {
      textAlign: "center",
      fontStyle: "italic",
      fontSize: 17,
      color: colors.semilight,
      fontWeight: "bold",
    },
    versionContainer: {
      justifyContent: "flex-end",
      flex: 1,
      padding: "5%",
      alignItems: "center",
      width: "100%",
    },
    versionText: {
      fontSize: 14,
      color: "#888",
      width: "100%",
      textAlign: "center",
      borderTopWidth: 1,
      borderColor: "#e4e4e4",
      paddingTop: "1%",
    },
  });

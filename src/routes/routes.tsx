import React, { useEffect, useState } from "react";
import { Modal, Platform, StatusBar, View } from "react-native";

//import { User as FirebaseUser } from "firebase/auth";
//import { auth } from "../services/firebaseConfig";

import { Login } from "../screens/Login";
import { StackNavigator } from "../../src/navigation/StackNavigator";
import { useTheme } from "../../src/context/useThemeContext";
import { InitialScreen } from "../../src/screens/InitialScreen";
import { ModalHasUpdate } from "../../src/components/Modals/ModalHasUpdate";
import Constants from "expo-constants";
import VersionCheck from "react-native-version-check";

export function Routes() {
  // const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);

  const { ColorTheme } = useTheme();

  // useEffect(() => {
  //   checkForUpdates();
  //   const onSubscribe = auth.onAuthStateChanged(
  //     (firebaseUser: FirebaseUser | null) => {
  //       setUser(firebaseUser);
  //       setLoading(false);
  //     }
  //   );
  //   return onSubscribe;
  // }, []);

  async function checkForUpdates() {
    try {
      const androidPackageName = Constants.expoConfig?.android?.package;
      if (!androidPackageName) return;

      const currentVersion = Constants.expoConfig?.version;
      if (!currentVersion) return;

      const latestVersion = await VersionCheck.getLatestVersion({
        provider: Platform.OS === "android" ? "playStore" : "appStore",
        packageName: Platform.OS === "android" ? androidPackageName : "",
      });
      const hasUpdate = latestVersion > currentVersion;
      console.log(latestVersion);
      console.log(currentVersion);

      if (hasUpdate) {
        setModalVisible(true);
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1 }}>
  //       <StatusBar backgroundColor={ColorTheme.dark} translucent={false} />
  //       <InitialScreen />
  //     </View>
  //   );
  // }

  return (
    <View style={{ flex: 1 }}>
      {/* <StatusBar backgroundColor={ColorTheme.dark} translucent={false} />
      {user ? <StackNavigator /> : <Login />}

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalHasUpdate handleClose={() => setModalVisible(false)} />
      </Modal> */}
      <StackNavigator />
    </View>
  );
}

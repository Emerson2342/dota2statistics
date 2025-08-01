import React, { useEffect, useState } from "react";
import { Modal, Platform, StatusBar, View } from "react-native";

import { StackNavigator } from "../../src/navigation/StackNavigator";
import { useTheme } from "../../src/context/useThemeContext";
import { ModalHasUpdate } from "../../src/components/Modals/ModalHasUpdate";
import Constants from "expo-constants";
import VersionCheck from "react-native-version-check";

export function Routes() {
  const [modalVisible, setModalVisible] = useState(false);
  const { ColorTheme } = useTheme();

  useEffect(() => {
    checkForUpdates();
  }, []);

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

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={ColorTheme.dark} />
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalHasUpdate handleClose={() => setModalVisible(false)} />
      </Modal>
      <StackNavigator />
    </View>
  );
}

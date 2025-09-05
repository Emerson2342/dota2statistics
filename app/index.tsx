import React from "react";
import { DrawerNavigatorScreen } from "./../src/navigation/DrawerNavigator";
import { View, Text } from "react-native";
import { BannerAds } from "../src/components/Admob/BannerAds";

export default function Home() {
  return (
    <View style={{ flex: 1 }}>
      <DrawerNavigatorScreen />
      <BannerAds />
    </View>
  );
}

import React from "react";
import { View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const adUnitId = "ca-app-pub-4117477719356991/2967249153";
const testeId = "ca-app-pub-3940256099942544/6300978111";

export function BannerAds() {
  return (
    <View style={{ display: "flex" }}>
      <BannerAd
        unitId={__DEV__ ? testeId : adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
}

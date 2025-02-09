import React from "react";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const adUnitId = "ca-app-pub-3940256099942544/9214589741";

export function BannerAds() {
  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: false,
      }}
    />
  );
}

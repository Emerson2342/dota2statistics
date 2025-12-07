import { View } from "react-native";
import { TeamFightsTabs } from "../src/screens/MatchDetails/TeamFightsTabs";
import { BannerAds } from "../src/components/Admob/BannerAds";

export default function TeamFights() {
  return (
    <View style={{ flex: 1 }}>
      <TeamFightsTabs />
      <BannerAds />
    </View>
  );
}

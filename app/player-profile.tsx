import { useLocalSearchParams } from "expo-router";
import PlayerProfileScreen from "@src/screens/PlayerProfile";
import { View } from "react-native";
import { BannerAds } from "@src/components/Admob/BannerAds";

type PlayerProfileParams = {
  playerId: string;
};

export default function PlayerProfile() {
  const { playerId } = useLocalSearchParams<PlayerProfileParams>();

  return (
    <View style={{ flex: 1 }}>
      <PlayerProfileScreen playerId={playerId} />
      <BannerAds />
    </View>
  );
}

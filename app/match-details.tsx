import { useLocalSearchParams } from "expo-router";
import { MatchDetailsScreen } from "@src/screens/MatchDetails";
import { View } from "react-native";
import { BannerAds } from "@src/components/Admob/BannerAds";

type MatchDetailsParams = {
  matchDetailsId: string;
  playerIdIndex?: string;
};

export default function MatchDetails() {
  const { matchDetailsId, playerIdIndex } =
    useLocalSearchParams<MatchDetailsParams>();
  return (
    <View style={{ flex: 1 }}>
      <MatchDetailsScreen
        matchDetailsId={matchDetailsId}
        playerIdIndex={playerIdIndex}
      />
      <BannerAds />
    </View>
  );
}

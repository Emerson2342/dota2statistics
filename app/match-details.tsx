import { useLocalSearchParams } from "expo-router";
import { MatchDetailsScreen } from "../src/screens/MatchDetails";
import { View } from "react-native";
import { BannerAds } from "../src/components/Admob/BannerAds";

type MatchDetailsParams = {
  matchDetailsId: string;
  playerIdIndex?: string;
  lobbyType?: string;
  gameMode?: string;
};

export default function MatchDetails() {
  const { matchDetailsId, playerIdIndex, lobbyType, gameMode } =
    useLocalSearchParams<MatchDetailsParams>();
  return (
    <View style={{ flex: 1 }}>
      <MatchDetailsScreen
        matchDetailsIndex={matchDetailsId}
        gameMode={gameMode}
        lobbyType={lobbyType}
        playerIdIndex={playerIdIndex}
      />
      <BannerAds />
    </View>
  );
}

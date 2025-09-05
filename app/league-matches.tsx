import { useLocalSearchParams } from "expo-router";
import { LeagueMatchesScreen } from "../src/screens/LeagueMatches/LeagueMatches";
import { BannerAds } from "../src/components/Admob/BannerAds";
import { View } from "react-native";

type LeagueMatchesParams = {
  leagueId: string;
  leagueName: string;
};

export default function LeagueMatches() {
  const { leagueId, leagueName } = useLocalSearchParams<LeagueMatchesParams>();
  return (
    <View style={{ flex: 1 }}>
      <LeagueMatchesScreen
        LeagueIdIndex={Number(leagueId)}
        LeagueName={leagueName}
      />
      <BannerAds />
    </View>
  );
}

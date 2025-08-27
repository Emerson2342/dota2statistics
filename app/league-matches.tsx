import { useLocalSearchParams } from "expo-router";
import { LeagueMatchesScreen } from "../src/screens/LeagueMatches/LeagueMatches";

type LeagueMatchesParams = {
  LeagueIdIndex: string;
  LeagueName: string;
};

export default function LeagueMatches() {
  const { LeagueIdIndex, LeagueName } =
    useLocalSearchParams<LeagueMatchesParams>();
  return (
    <LeagueMatchesScreen
      LeagueIdIndex={Number(LeagueIdIndex)}
      LeagueName={LeagueName}
    />
  );
}

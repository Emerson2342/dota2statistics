import { useLocalSearchParams } from "expo-router";
import { LeagueMatchesScreen } from "../src/screens/LeagueMatches/LeagueMatches";

type LeagueMatchesParams = {
  leagueId: string;
  leagueName: string;
};

export default function LeagueMatches() {
  const { leagueId, leagueName } = useLocalSearchParams<LeagueMatchesParams>();
  return (
    <LeagueMatchesScreen
      LeagueIdIndex={Number(leagueId)}
      LeagueName={leagueName}
    />
  );
}

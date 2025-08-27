import { useLocalSearchParams } from "expo-router";
import { MatchDetailsScreen } from "../src/screens/MatchDetails";

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
    <MatchDetailsScreen
      matchDetailsIndex={matchDetailsId}
      gameMode={gameMode}
      lobbyType={lobbyType}
      playerIdIndex={playerIdIndex}
    />
  );
}

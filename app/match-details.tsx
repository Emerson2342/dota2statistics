import { useLocalSearchParams } from "expo-router";
import { MatchDetailsScreen } from "../src/screens/MatchDetails";

type MatchDetailsParams = {
  matchDetailsIndex: string;
  playerIdIndex?: string;
  lobbyType?: string;
  gameMode?: string;
};

export default function MatchDetails() {
  const { matchDetailsIndex, playerIdIndex, lobbyType, gameMode } =
    useLocalSearchParams<MatchDetailsParams>();
  return (
    <MatchDetailsScreen
      matchDetailsIndex={matchDetailsIndex}
      gameMode={gameMode}
      lobbyType={lobbyType}
      playerIdIndex={playerIdIndex}
    />
  );
}

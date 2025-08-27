import { useLocalSearchParams } from "expo-router";
import PlayerProfileScreen from "../src/screens/PlayerProfile";

type PlayerProfileParams = {
  playerId: string;
};

export default function PlayerProfile() {
  const { playerId } = useLocalSearchParams<PlayerProfileParams>();

  return <PlayerProfileScreen playerId={playerId} />;
}

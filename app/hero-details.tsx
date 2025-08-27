import { useLocalSearchParams } from "expo-router";
import HeroDetailsScreen from "../src/screens/HeroDetails";

type HeroDetailsParams = {
  heroId: string;
};

export default function HeroDetails() {
  const { heroId } = useLocalSearchParams<HeroDetailsParams>();
  return <HeroDetailsScreen heroId={heroId} />;
}

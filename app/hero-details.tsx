import { useLocalSearchParams } from "expo-router";
import HeroDetailsScreen from "../src/screens/HeroDetails";
import { View } from "react-native";
import { BannerAds } from "../src/components/Admob/BannerAds";

type HeroDetailsParams = {
  heroId: string;
};

export default function HeroDetails() {
  const { heroId } = useLocalSearchParams<HeroDetailsParams>();
  return (
    <View style={{ flex: 1 }}>
      <HeroDetailsScreen heroId={heroId} />
      <BannerAds />
    </View>
  );
}

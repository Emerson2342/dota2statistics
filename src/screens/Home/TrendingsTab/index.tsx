import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { HeroesStats } from "./HeroesStats";
import { ProMatches } from "./ProMatches";
import { BannerAds } from "../../../../src/components/Admob/BannerAds";
import { HeroStats, LeagueMatches } from "../../../../src/services/props";

type Props = {
  color: string;
  heroesStats: [] | HeroStats[];
  proMatches: [] | LeagueMatches[];
  onRefresh: () => Promise<void>;
};

export function TrendingsTab({
  color,
  heroesStats,
  onRefresh,
  proMatches,
}: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={{ flex: 0.3 }}>
        <HeroesStats heroesStats={heroesStats} />
      </View>
      <View style={{ flex: 0.7 }}>
        <ProMatches onRefresh={onRefresh} proMatches={proMatches} />
      </View>
      <BannerAds />
    </View>
  );
}

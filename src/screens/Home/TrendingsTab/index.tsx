import React from "react";
import { View } from "react-native";
import { HeroesStats } from "./HeroesStats";
import { ProMatches } from "./ProMatches";
import { HeroStats, LeagueMatches } from "@src/services/props";
import { WaveTrendings } from "@src/components/Waves";

type Props = {
  color: string;
  heroesStats: HeroStats[];
  proMatches: LeagueMatches[];
  onRefresh: () => Promise<any>;
};

export function TrendingsTab({ heroesStats, onRefresh, proMatches }: Props) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f5f5f5",
      }}
    >
      <WaveTrendings />
      <HeroesStats heroesStats={heroesStats} />
      <ProMatches onRefresh={onRefresh} proMatches={proMatches} />
    </View>
  );
}

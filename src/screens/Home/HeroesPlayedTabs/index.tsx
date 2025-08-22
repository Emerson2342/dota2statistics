import React from "react";
import { View } from "react-native";
import { HeroesPlayedComponent } from "./HeroesPlayedComponent";
import { HeroesPlayed } from "../../../../src/services/props";

type Props = {
  PlayerId: string;
  IsPlayerProfile: boolean;
};

export function HeroesPlayedTabs({ PlayerId, IsPlayerProfile }: Props) {
  return (
    <HeroesPlayedComponent
      PlayerId={PlayerId}
      isHomeProfile={IsPlayerProfile}
    />
  );
}

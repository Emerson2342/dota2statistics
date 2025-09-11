import { Dispatch } from "react";
import { HeroAbilitiesDescriptionsJson } from "../../src/services/props";
import AbilitiesDescriptions from "../components/Heroes/AbilitiesDescriptions.json";

export const modalAbilitiesDetails = (abilityName: string) => {
  const abilities: HeroAbilitiesDescriptionsJson = AbilitiesDescriptions;
  abilityName = abilityName.replace(".png", "");
  const abilityDetails = abilities[abilityName];

  return {
    abilityIndex: abilityDetails,
    modalAbilityDetails: !!abilityDetails,
  };
};

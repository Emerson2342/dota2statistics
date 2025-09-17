import { useEffect, useState } from "react";
import { HeroDetailsModel } from "../services/props";
import HeroesDetails from "../components/Heroes/HeroesDetails.json";

export default function getHeroDetails(heroId: number): HeroDetailsModel {
  const heroArray = Object.values(HeroesDetails) as HeroDetailsModel[];

  const hero = heroArray.find((hero) => hero.id === Number(heroId));

  if (hero) return hero;
  return {
    id: 0,
    name: "",
    primary_attr: "",
    attack_type: "",
    roles: [],
    img: "",
    icon: "",
    base_health: 0,
    base_health_regen: 0,
    base_mana: 0,
    base_mana_regen: 0,
    base_armor: 0,
    base_mr: 0,
    base_attack_min: 0,
    base_attack_max: 0,
    base_str: 0,
    base_agi: 0,
    base_int: 0,
    str_gain: 0,
    agi_gain: 0,
    int_gain: 0,
    attack_range: 0,
    projectile_speed: 0,
    attack_rate: 0,
    move_speed: 0,
    turn_rate: 0,
    cm_enabled: false,
    legs: 0,
    localized_name: "",
  };
}

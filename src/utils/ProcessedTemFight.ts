import { TeamFightModel } from "../../src/services/props";

export function processTeamFights(
  teamFights: TeamFightModel[],
  formatTime: (s?: number) => string
) {
  console.log("Chamou a function");
  return teamFights.map((fight) => {
    const damageArray = fight.players?.map((p) => p.damage) || [];
    const goldArray = fight.players?.map((p) => p.gold_delta) || [];
    const xpArray = fight.players?.map((p) => p.xp_delta) || [];
    const healingArray = fight.players?.map((p) => p.healing) || [];

    return {
      ...fight,
      formattedTime: formatTime(fight.start),
      endTime: formatTime(fight.end),
      damageRad: damageArray.slice(0, 5).map((value) => ({ y: value })),
      damageDire: damageArray.slice(5, 10).map((value) => ({ y: value })),
      goldRad: goldArray.slice(0, 5).map((value) => ({ y: value })),
      goldDire: goldArray.slice(5, 10).map((value) => ({ y: value })),
      xpRad: xpArray.slice(0, 5).map((value) => ({ y: value })),
      xpDire: xpArray.slice(5, 10).map((value) => ({ y: value })),
      healingRad: healingArray.slice(0, 5).map((value) => ({ y: value })),
      healingDire: healingArray.slice(5, 10).map((value) => ({ y: value })),
      emptyRadKilledList: fight.players
        ?.slice(0, 5)
        .every((p) => Object.keys(p.killed).length === 0),
      emptyDireKilledList: fight.players
        ?.slice(5, 10)
        .every((p) => Object.keys(p.killed).length === 0),
    };
  });
}

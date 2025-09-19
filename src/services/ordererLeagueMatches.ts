import { LeagueMatches } from "./props";

export const OrdererLeagueMatches = (
  matches: LeagueMatches[]
): LeagueMatches[] => {
  const ordererMatches = matches.sort((a, b) => b.start_time - a.start_time);
  const newList = ordererMatches.slice(0, 20);
  return newList;
};

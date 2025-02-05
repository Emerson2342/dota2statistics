import React from "react";
import {
  HERO_BENCHMARCKS_BASE_URL,
  HERO_ITEM_BASE_URL,
  PRO_MATCHES_URL,
} from "../constants/player";
import {
  HeroBenchmarksData,
  ItemPopularityData,
  LeagueMatches,
  MatchDetailsModel,
  Player,
  PlayerModel,
  RecentMatches,
  SearchUserResult,
} from "../services/props";

export const getSearchPlayer = async (
  url: string,
  setPlayer: React.Dispatch<React.SetStateAction<PlayerModel | null>>
) => {
  const response = await fetch(url);
  const data = (await response.json()) as PlayerModel;
  const playerData: PlayerModel = {
    profile: {
      name: data.profile?.name || "",
      account_id: data.profile?.account_id || 0,
      personaname: data.profile?.personaname || "",
      avatarfull: data.profile?.avatarfull || "",
    },
    rank_tier: data.rank_tier || 0,
    leaderboard_rank: data.leaderboard_rank || null,
  };
  setPlayer(playerData);
};

export const searchPlayersByName = async (
  url: string,
  setUsersSearch: React.Dispatch<React.SetStateAction<SearchUserResult[] | []>>
) => {
  try {
    const response = await fetch(url);
    const data = (await response.json()) as SearchUserResult[];
    setUsersSearch(data);
  } catch (error: any) {
    console.log("Erro ao tentar procurar jogadores: " + error.message);
  }
};

export const getProMatches = async (
  setProMatches: React.Dispatch<React.SetStateAction<LeagueMatches[] | []>>
) => {
  const response = await fetch(PRO_MATCHES_URL);
  const data = (await response.json()) as LeagueMatches[];
  const orderedProMatches = data.sort((a, b) => b.start_time - a.start_time);
  const newList = orderedProMatches.slice(0, 30);
  setProMatches(newList);
};

export const getMatchDetails = async (url: string) => {
  try {
    const response = await fetch(url);
    const data = (await response.json()) as MatchDetailsModel;
    if (data) {
      const matchDataResponse: MatchDetailsModel = {
        players: data.players.map(
          (player: any): Player => ({
            account_id: player.account_id,
            win: player.win,
            lose: player.lose,
            duration: player.duration,
            personaname: player.personaname,
            name: player.name,
            hero_id: player.hero_id,
            item_0: player.item_0,
            item_1: player.item_1,
            item_2: player.item_2,
            item_3: player.item_3,
            item_4: player.item_4,
            item_5: player.item_5,
            backpack_0: player.backpack_0,
            backpack_1: player.backpack_1,
            backpack_2: player.backpack_2,
            item_neutral: player.item_neutral,
            start_time: player.start_time,
            kills: player.kills,
            deaths: player.deaths,
            assists: player.assists,
            last_hits: player.last_hits,
            denies: player.denies,
            gold_per_min: player.gold_per_min,
            total_xp: player.total_xp,
            xp_per_min: player.xp_per_min,
            level: player.level,
            net_worth: player.net_worth,
            aghanims_scepter: player.aghanims_scepter,
            aghanims_shard: player.aghanims_shard,
            hero_damage: player.hero_damage,
            tower_damage: player.tower_damage,
            hero_healing: player.hero_healing,
            isRadiant: player.isRadiant,
            rank_tier: player.rank_tier,
            benchmarks: {
              gold_per_min: player.benchmarks?.gold_per_min,
              xp_per_min: player.benchmarks?.xp_per_min,
              kills_per_min: player.benchmarks?.kills_per_min,
              last_hits_per_min: player.benchmarks?.last_hits_per_min,
              hero_damage_per_min: player.benchmarks?.hero_damage_per_min,
              hero_healing_per_min: player.benchmarks?.hero_healing_per_min,
              tower_damage: player.benchmarks?.tower_damage,
            },
            ability_upgrades_arr: player.ability_upgrades_arr,
          })
        ),
        radiant_win: data.radiant_win,
        duration: data.duration,
        start_time: data.start_time,
        match_id: data.match_id,
        tower_status_radiant: data.tower_status_radiant,
        tower_status_dire: data.tower_status_dire,
        barracks_status_radiant: data.barracks_status_radiant,
        barracks_status_dire: data.barracks_status_dire,
        game_mode: data.game_mode,
        radiant_score: data.radiant_score,
        dire_score: data.dire_score,
        picks_bans: data.picks_bans,
        radiant_gold_adv: data.radiant_gold_adv,
        radiant_xp_adv: data.radiant_xp_adv,
      };
      return matchDataResponse;
    }

  } catch (error) {
    console.error("Erro buscar partida: " + error);
    return null;
  }
};

export const getRecentMatches = async (
  url: string,
  setRecentMatches: React.Dispatch<React.SetStateAction<[] | RecentMatches[]>>,
  setHeroesPlayedId: React.Dispatch<React.SetStateAction<[] | number[]>>
) => {
  const response = await fetch(url);
  try {
    if (response.status < 201) {
      const data = (await response.json()) as RecentMatches[];
      const matchDataResponse: RecentMatches[] = data.map((match) => ({
        match_id: match.match_id,
        player_slot: match.player_slot,
        radiant_win: match.radiant_win,
        hero_id: match.hero_id,
        start_time: match.start_time,
        duration: match.duration,
        game_mode: match.game_mode,
        lobby_type: match.lobby_type,
        kills: match.kills,
        deaths: match.deaths,
        assists: match.assists,
        average_rank: match.average_rank,
        xp_per_min: match.xp_per_min,
        gold_per_min: match.gold_per_min,
        hero_damage: match.hero_damage,
        tower_damage: match.tower_damage,
        hero_healing: match.hero_healing,
        last_hits: match.last_hits,
        lane: match?.lane,
        lane_role: match.lane_role,
        leaver_status: match.leaver_status,
      }));
      setRecentMatches(matchDataResponse);

      const heroesPlayedId: number[] = [
        ...new Set(data.map((match) => match.hero_id)),
      ];
      setHeroesPlayedId(heroesPlayedId);
    }
    return response.status;
  } catch (error: any) {
    console.log("Erro na solicitaçãosss:" + error.message);
  }
};

export const getItemsByHero = async (heroId: number | undefined) => {
  try {
    const itemPopularity = HERO_ITEM_BASE_URL + `/${heroId}/itemPopularity`;
    const response = await fetch(itemPopularity);
    const data = (await response.json()) as ItemPopularityData;
    return data;
  } catch (error) {
    console.error("Erro ao buscar os dados da API heroItems:", error);
    return null;
  }
};

export const getHeroBenchMarks = async (heroId: number | undefined) => {
  try {
    const benchmarks = HERO_BENCHMARCKS_BASE_URL + `${heroId}`;
    const response = await fetch(benchmarks);
    const data = (await response.json()) as HeroBenchmarksData;

    const filteredData: HeroBenchmarksData = {
      hero_id: heroId,
      result: {
        gold_per_min: data.result.gold_per_min.filter(
          (item) => item.percentile === 0.5
        ),
        xp_per_min: data.result.xp_per_min.filter(
          (item) => item.percentile === 0.5
        ),
        kills_per_min: data.result.kills_per_min.filter(
          (item) => item.percentile === 0.5
        ),
        last_hits_per_min: data.result.last_hits_per_min.filter(
          (item) => item.percentile === 0.5
        ),
        hero_damage_per_min: data.result.hero_damage_per_min.filter(
          (item) => item.percentile === 0.5
        ),
        hero_healing_per_min: data.result.hero_healing_per_min.filter(
          (item) => item.percentile === 0.5
        ),
        tower_damage: data.result.tower_damage.filter(
          (item) => item.percentile === 0.5
        ),
      },
    };
    return filteredData;
  } catch (error) {
    console.error("Erro ao buscar os dados da API benchmarcks: ", error);
    return null;
  }
};

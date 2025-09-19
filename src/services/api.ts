import React, { Dispatch } from "react";
import { HERO_STATS_URL } from "../constants/player";
import {
  HeroesPlayed,
  HeroStats,
  MatchDetailsModel,
  Player,
  RecentMatches,
} from "./props";

export const fetchData = async <T>(url: string): Promise<T> => {
  console.log("Entrou no endpoint - " + url);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Error trying to get data from - " + url);
    }
    const data: T = await res.json();
    return data;
  } catch (error: any) {
    console.log("Error - ", error.message);
    throw new Error("Error trying to get data from - " + url);
  }
};

export const getMatchDetails = async (url: string) => {
  try {
    console.log("Endpoint matchDetails: " + url);
    const response = await fetch(url);

    if (!response.ok) {
      console.log("Erro na chamada da API: ", url, response.status);
      return null;
    }

    const data = (await response.json()) as MatchDetailsModel;

    if (data) {
      const matchDataResponse: MatchDetailsModel = {
        players: data.players.map(
          (player: Player): Player => ({
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
            killed: player.killed,
            killed_by: player.killed_by,
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
            damage_inflictor_received: player.damage_inflictor_received,
            damage_inflictor: player.damage_inflictor,
            gold_t: player.gold_t,
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
        league: data.league,
        radiant_team: data.radiant_team,
        dire_team: data.dire_team,
        teamfights: data.teamfights,
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
  setHeroesPlayedId: React.Dispatch<React.SetStateAction<[] | number[]>>,
  setRecentMatches?: React.Dispatch<React.SetStateAction<[] | RecentMatches[]>>
) => {
  const response = await fetch(url);
  try {
    if (response.status < 201) {
      console.log("Endpoint recentMatches: " + url);
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
      setRecentMatches && setRecentMatches(matchDataResponse);

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

export const getHeroesPlayed = async (
  url: string,
  setErrorResponse: Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setErrorResponse(false);
    console.log("Endpoint heroesPlayed: " + url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Erro na resposta da API: ${response.status} ${response.statusText}`
      );
    }
    const data = (await response.json()) as HeroesPlayed[];

    return data.slice(0, 50);
  } catch (error: any) {
    setErrorResponse(true);
    console.log("Erro ao buscar herois jogados: " + error.message);
  }
};

export const getHeroesStats = async (
  setHeroStatsList: React.Dispatch<React.SetStateAction<HeroStats[] | []>>
) => {
  try {
    console.log("Endpoint heroStats: " + HERO_STATS_URL);
    const response = await fetch(HERO_STATS_URL);
    const data = (await response.json()) as HeroStats[];

    const filteredData = data.map((hero) => ({
      id: hero.id,
      localized_name: hero.localized_name,
      img: hero.img,
      turbo_picks: hero.turbo_picks,
      turbo_picks_trend: hero.turbo_picks_trend,
      turbo_wins: hero.turbo_wins,
      turbo_winds_trend: hero.turbo_winds_trend,
      pub_pick: hero.pub_pick,
      pub_pick_trend: hero.pub_pick_trend,
      pub_win: hero.pub_win,
      pub_win_trend: hero.pub_win_trend,
    }));
    setHeroStatsList(filteredData);
  } catch (error: any) {
    console.log("Erro ao buscar Hero Stats: " + error.message);
  }
};

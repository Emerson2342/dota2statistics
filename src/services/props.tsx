import { Dispatch, SetStateAction } from "react";
import { GameMode, LobbyType } from "./enum";

export interface PlayerModel {
  profile: {
    name: string;
    account_id: number;
    personaname: string;
    avatarfull: string;
  };
  rank_tier: number;
  leaderboard_rank: null;
}

export interface FavoritesContextType {
  addFavoritePlayer: (player: PlayerModel) => void;
  removeFavoritePlayer: (playerId: number) => void;
  favoritesPlayers: PlayerModel[] | [];
}

export interface User {
  id_Steam: string;
}
export interface SearchUserResult {
  account_id: number;
  personaname: string;
  avatarfull: string;
}

export interface ThemeColor {
  dark: string;
  semidark: string;
  standard: string;
  semilight: string;
  light: string;
}

export interface FontModel {
  font1: string;
  font2: string;
  font3: string;
}

export type HandleCloseInterface = () => void;

export interface Friend {
  friend: string;
  idFriend: number;
}

export interface ModalRef {
  open: () => void;
  close: () => void;
}

export interface ModalItemData {
  item?: ItemDetails;
  shard?: AghanimModel;
  aghanim?: AghanimModel;
  type: string;
}

export interface ItemDetails {
  id: number;
  name?: string;
  dname?: string;
  img: string;
  lore?: string;
  notes?: string | null;
  abilities?: {
    type: string;
    title: string;
    description: string;
  }[];
}

export interface FriendDetailsModel {
  friend: string;
  idFriend: number;
  avatar?: string;
  personaname?: string;
  name?: string;
  account_id: number;
  medal?: number;
  att: string;
  profile?: {
    account_id?: number;
    personaname?: string;
    avatarfull?: string;
    name?: string;
  };
  rank_tier?: number;
  leaderboard_rank?: null;
}

export interface RecentMatches {
  match_id: number;
  radiant_win: boolean;
  hero_id: number;
  player_slot: number;
  start_time: number;
  duration: number;
  game_mode: number;
  lobby_type: number;
  kills: number;
  deaths: number;
  assists: number;
  average_rank: number;
  xp_per_min: number;
  gold_per_min: number;
  hero_damage: number;
  tower_damage: number;
  hero_healing: number;
  last_hits: number;
  lane: number | null;
  lane_role: number | null;
  leaver_status: number;
}

export interface HeroStats {
  id: number;
  localized_name: string;
  img: string;
  turbo_picks: number;
  turbo_picks_trend: number[];
  turbo_wins: number;
  turbo_winds_trend: number[];
  pub_pick: number;
  pub_pick_trend: number[];
  pub_win: number;
  pub_win_trend: number[];
  winRate?: number;
  totalPicks?: number;
}

export const LobbyTypeNames: Record<LobbyType, string> = {
  [LobbyType.Casual]: "Casual",
  [LobbyType.Practice]: "Practice",
  [LobbyType.Tournament]: "Tournament",
  [LobbyType.Tutorial]: "Tutorial",
  [LobbyType.Bots]: "Bots",
  [LobbyType.TeamMatch]: "Team Match",
  [LobbyType.SoloQueue]: "Solo Queue",
  [LobbyType.Ranked]: "Ranked",
  [LobbyType.SoloMid]: "Solo Mid",
};

export const GameModeNames: Record<GameMode, string> = {
  [GameMode.Unknown]: "Unknown",
  [GameMode.AllPick]: "All Pick",
  [GameMode.CaptainsMode]: "Captains Mode",
  [GameMode.RandomDraft]: "Random Draft",
  [GameMode.SingleDraft]: "Single Draft",
  [GameMode.TeamAllRandom]: "Team All Random",
  [GameMode.Intro]: "Intro",
  [GameMode.Diretide]: "Diretide",
  [GameMode.ReverseCaptainMode]: "Reverse Captain Mode",
  [GameMode.Greeviling]: "Greeviling",
  [GameMode.Tutorial]: "Tutorial",
  [GameMode.MidOnly]: "Mid Only",
  [GameMode.LeastPlayed]: "Least Played",
  [GameMode.LimitedHeroes]: "Limited Heroes",
  [GameMode.Compendium]: "Compendium",
  [GameMode.Custom]: "Custom",
  [GameMode.CaptainsDraft]: "Captains Draft",
  [GameMode.BalancedDraft]: "Balanced Draft",
  [GameMode.AbilityDraft]: "Ability draft",
  [GameMode.Event]: "Event",
  [GameMode.RdDeathMatch]: "Rd Death Match",
  [GameMode.OneVsOneMid]: "1v1 Mid",
  [GameMode.AllDraft]: "All Draft",
  [GameMode.Turbo]: "Turbo",
  [GameMode.Mutation]: "Mutation",
  [GameMode.CoachChallenge]: "Coach Challenge",
};

export interface HeroInfo {
  heroId: number;
  winCount: number;
  lossCount: number;
}
export interface WinrateHero {
  heroId: number;
  localized_name: string;
  vitorias: number;
  derrotas: number;
}

export interface WL {
  player: {
    heroId: number;
    winCount: number;
    lossCount: number;
    matchCount: number;
  };
}
export interface Hero {
  displayName: string;
  id: number;
}

export interface HeroAbilitiesDetailsModel {
  abilities: string[];
  facets: FacetsModel[];
}

export interface HeroAbilitiesDescriptionsModel {
  dname?: string;
  is_innate?: boolean;
  behavior?: string | string[];
  dmg_type?: string | string[];
  bkbpierce?: string | string[];
  dispellable?: string;
  target_team?: string | string[];
  target_type?: string | string[];
  desc?: string;
  lore?: string;
  mc?: string | string[];
  cd?: string | string[];
  img?: string;
}

export interface TalentsModel {
  name: string;
  level: number;
}

export interface FacetsModel {
  id: number;
  name: string;
  icon: string;
  color: string;
  gradient_id: number;
  title: string;
  description: string;
  abilities?: string[];
  deprecated?: string;
}

export interface MatchLeagueInfo {
  RadName: string | undefined;
  DireName: string | undefined;
  LeagueName: string;
}
export interface HeroesPlayed {
  hero_id: number;
  last_played: number;
  games: number;
  win: number;
  with_games: number;
  with_win: number;
  against_games: number;
  against_win: number;
}

export interface PlayerTeamFight {
  ability_uses: {
    [key: string]: number;
  };
  item_uses: {
    [key: string]: number;
  };
  killed: {
    [key: string]: number;
  };
  deaths: number;
  buybacks: number;
  damage: number;
  healing: number;
  gold_delta: number;
  xp_delta: number;
  xp_start?: number;
  xp_end?: number;
}

export interface TeamFightModel {
  start: number;
  end?: number;
  deaths?: number;
  players?: PlayerTeamFight[];
}

export interface MatchDetailsModel {
  teamfights?: TeamFightModel[];
  players: Player[];
  radiant_win: boolean;
  duration: number;
  start_time: number;
  match_id: number;
  tower_status_radiant: number;
  tower_status_dire: number;
  barracks_status_radiant: number;
  barracks_status_dire: number;
  game_mode: number;
  radiant_score: number;
  dire_score: number;
  picks_bans: [
    {
      is_pick: boolean;
      hero_id: number;
      team: number;
      order: number;
    }
  ];
  radiant_gold_adv: number[];
  radiant_xp_adv: number[];
  league?: {
    leagueid?: number;
    ticket?: any;
    banner?: any;
    tier?: string;
    name?: string;
  };
  radiant_team?: {
    team_id?: number;
    name?: string;
    tag?: string;
    logo_url?: string;
  };
  dire_team?: {
    team_id?: number;
    name?: string;
    tag?: string;
    logo_url?: string;
  };
}

export interface Player {
  account_id: number;
  win: number;
  lose: number;
  duration: number;
  hero_id: number;
  item_0: number;
  item_1: number;
  item_2: number;
  item_3: number;
  item_4: number;
  item_5: number;
  backpack_0: number;
  backpack_1: number;
  backpack_2: number;
  item_neutral: number;
  killed: Kill;
  killed_by: KilledBy;
  start_time: number;
  kills: number;
  deaths: number;
  assists: number;
  last_hits: number;
  denies: number;
  gold_per_min: number;
  total_xp: number;
  xp_per_min: number;
  level: number;
  net_worth: number;
  aghanims_scepter: number;
  aghanims_shard: number;
  hero_damage: number;
  tower_damage: number;
  hero_healing: number;
  isRadiant: boolean;
  rank_tier: number;
  personaname: string | null;
  name: string | null;
  benchmarks: {
    gold_per_min: {
      raw?: number | null;
      pct?: number | null;
    };
    xp_per_min: {
      raw?: number | null;
      pct?: number | null;
    };
    kills_per_min: {
      raw?: number | null;
      pct?: number | null;
    };
    last_hits_per_min: {
      raw?: number | null;
      pct?: number | null;
    };
    hero_damage_per_min: {
      raw?: number | null;
      pct?: number | null;
    };
    hero_healing_per_min: {
      raw?: number | null;
      pct?: number | null;
    };
    tower_damage: {
      raw?: number | null;
      pct?: number | null;
    };
  };
  ability_upgrades_arr: [number];
  damage_inflictor_received?: {
    [key: string]: number;
  };
  damage_inflictor?: {
    [key: string]: number;
  };
  gold_t?: number[];
}

export interface GoldPlayers {
  hero_id: number;
  gold_t: number[] | [];
}

export interface KillDetails {
  playerName: string;
  heroName: string;
  kills: { heroName: string; count: number }[];
  killedBy: { heroName: string; count: number }[];
}

export interface Kill {
  [key: string]: number;
}

export interface KilledBy {
  [key: string]: number;
}

export interface ItemsModel {
  id?: number;
  img?: string;
  dname?: string;
}

export interface PlayerDetails {
  id: number;
  localized_name: string;
  resultado: string;
  match_id: number;
  account_id: number;
  win: number;
  lose: number;
  duration: number;
  start_time: number;
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
  last_hits: number;
  denies: number;
  gold_per_min: number;
  xp_per_min: number;
  level: number;
  net_worth: number;
  aghanims_scepter: number;
  aghanims_shard: number;
  hero_damage: number;
  tower_damage: number;
  hero_healing: number;
}

export interface Item {
  name: string;
  id: number;
  img: string;
  dmg_type?: string;
  dname: string;
}

export interface AghanimModel {
  hero_name: string;
  hero_id: number;
  has_scepter: boolean;
  scepter_desc: string;
  scepter_skill_name: string;
  scepter_new_skill: boolean;
  has_shard: boolean;
  shard_desc: string;
  shard_skill_name: string;
  shard_new_skill: boolean;
}

export interface HeroDetailsJson {
  [key: string]: HeroDetailsModel;
}
export interface HeroDetailsModel {
  id: number;
  name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  img: string;
  icon: string;
  base_health: number;
  base_health_regen: number | null;
  base_mana: number;
  base_mana_regen: number | null;
  base_armor: number;
  base_mr: number;
  base_attack_min: number;
  base_attack_max: number;
  base_str: number;
  base_agi: number;
  base_int: number;
  str_gain: number;
  agi_gain: number;
  int_gain: number;
  attack_range: number;
  projectile_speed: number;
  attack_rate: number;
  move_speed: number;
  turn_rate: number | null;
  cm_enabled: boolean;
  legs: number;
  localized_name: string;
}

export interface ItemPopularity {
  [itemId: string]: number;
}

export interface ItemPopularityData {
  start_game_items: ItemPopularity;
  early_game_items: ItemPopularity;
  mid_game_items: ItemPopularity;
  late_game_items: ItemPopularity;
}
export interface HeroItemsListPopularity {
  id: number | undefined;
  item: ItemPopularityData;
}
export interface HeroBenchmarksData {
  hero_id: number | undefined;
  result: HeroBenchmarksResult;
}

export interface HeroLore {
  [key: string]: string;
}

export interface HeroAbilitiesDetailsJson {
  [key: string]: HeroAbilitiesDetailsModel;
}

export interface HeroAbilitiesDescriptionsJson {
  [key: string]: HeroAbilitiesDescriptionsModel;
}

export interface ItemsJson {
  [key: string]: ItemsModel;
}

export interface HeroBenchmarksResult {
  gold_per_min: {
    percentile: number;
    value: number;
  }[];
  xp_per_min: {
    percentile: number;
    value: number;
  }[];
  kills_per_min: {
    percentile: number;
    value: number;
  }[];
  last_hits_per_min: {
    percentile: number;
    value: number;
  }[];
  hero_damage_per_min: {
    percentile: number;
    value: number;
  }[];
  hero_healing_per_min: {
    percentile: number;
    value: number;
  }[];
  tower_damage: {
    percentile: number;
    value: number;
  }[];
}

export interface HeroesAvarage {
  hero_id: number;
  gold_per_min: number;
  xp_per_min: number;
  kills: number;
  last_hits: number;
  hero_damage: number;
  tower_damage: number;
  hero_healing: number;
}

export interface MatchDetailsIndex {
  idMatchIndex: string | undefined;
  setIdMatchIndex: Dispatch<SetStateAction<string | undefined>>;
  idPlayerIndex: string | undefined;
  setIdPlayerIndex: Dispatch<SetStateAction<string | undefined>>;
}

export type RootStackParamList = {
  Drawer: undefined;
  MatchDetails: {
    MatchDetailsIndex: number;
    PlayerIdIndex: string | null;
    LobbyType?: string;
    GameMode?: string;
  };
  PlayerProfile: {
    PlayerId: string;
  };
  LeagueDetails: {
    LeagueIdIndex: number;
    LeagueName: string;
  };
  HeroDetails: {
    heroDetails: HeroDetailsModel;
  };
};

export interface StorageService {
  getItem: <T>(key: string) => Promise<T | null>;
  setItem: <T>(key: string, value: T) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

export interface League {
  leagueid: number;
  ticket: string | null;
  banner: string | null;
  tier: string;
  name: string;
}

export interface LeagueMatches {
  match_id: number;
  radiant_win: boolean;
  start_time: number;
  duration: number;
  leagueid: number;
  league_name: string | null;
  radiant_name: string | null;
  dire_name: string | null;
  radiant_score: number;
  dire_score: number;
  radiant_team_id: number;
  radiant_team_name: string | null;
  dire_team_id: number;
  dire_team_name: string | null;
  series_id: number;
  series_type: number;
}

export interface Team {
  team_id?: number;
  rating?: number;
  wins?: number;
  losses?: number;
  last_match_time?: number;
  name?: string;
  tag?: string;
  logo_url?: string;
}

export interface TeamPlayer {
  account_id: number;
  name: string;
  games_played: number;
  wins: number;
  is_current_team_member: boolean;
}

export interface HeroMatchUps {
  hero_id: number;
  games_played: number;
  wins: number;
}

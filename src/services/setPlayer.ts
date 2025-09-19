import { PlayerModel } from "./props";

export const SetPlayerModel = (profile: PlayerModel): PlayerModel => {
  const playerData: PlayerModel = {
    profile: {
      name: profile.profile?.name || "",
      account_id: profile.profile?.account_id || 0,
      personaname: profile.profile?.personaname || "",
      avatarfull: profile.profile?.avatarfull || "",
    },
    rank_tier: profile.rank_tier || 0,
    leaderboard_rank: profile.leaderboard_rank || null,
  };
  return playerData;
};

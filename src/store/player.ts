import AsyncStorage from "@react-native-async-storage/async-storage";
import { PLAYER_PROFILE_API_BASE_URL } from "@src/constants/player";
import {
  fetchData,
  getHeroesPlayed,
  getRecentMatches,
} from "@src/services/api";
import { HeroesPlayed, PlayerModel, RecentMatches } from "@src/services/props";
import { SetPlayerModel } from "@src/utils/setPlayer";
import { isLoading } from "expo-font";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PlayerStorage = {
  playerId: string | null;
  player: PlayerModel | null;
  heroesPlayedId: number[];
  heroesPlayed: HeroesPlayed[];
  isLoadingContext: boolean;
  recentMatches: RecentMatches[];
  handleFetchPlayerData: (id: string | undefined) => Promise<void>;
  setPlayerId: (id: string) => void;
};

export const usePlayerStore = create<PlayerStorage>()(
  persist(
    (set, get) => ({
      playerId: null,
      player: null,
      heroesPlayedId: [],
      heroesPlayed: [],
      isLoadingContext: false,
      recentMatches: [],
      setPlayerId(id) {
        set({ playerId: id });
      },

      handleFetchPlayerData: async (id) => {
        set({ isLoadingContext: true });

        const searchPlayer = `${PLAYER_PROFILE_API_BASE_URL}${id}`;
        await fetchData<PlayerModel>(searchPlayer)
          .then(async (res) => {
            if (res) {
              const playerRes = SetPlayerModel(res);
              set({ player: playerRes });
              const recentMatchesUrl = `${PLAYER_PROFILE_API_BASE_URL}${playerRes.profile.account_id}/recentMatches`;
              const { heroesPlayedIdFetch, recentMatchesFetch } =
                await getRecentMatches(recentMatchesUrl);
              set({
                heroesPlayedId: heroesPlayedIdFetch,
                recentMatches: recentMatchesFetch,
              });
              const url = `${PLAYER_PROFILE_API_BASE_URL}${playerRes?.profile.account_id}/heroes`;
              const heroesPlayedResponse = await getHeroesPlayed(url);
              if (heroesPlayedResponse && heroesPlayedResponse?.length > 0) {
                const heroesRes = heroesPlayedResponse.filter(
                  (item) => item.games > 0
                );
                set({ heroesPlayed: heroesRes });
              }
            } else {
              set({ player: null });
            }
          })
          .catch((error) => {
            console.log("Error trying to get profile", error.message);
            set({ player: null });
          })
          .finally(() => set({ isLoadingContext: false }));
      },
    }),
    {
      name: "playerId",
      partialize: (state) => ({
        playerId: state.playerId,
      }),
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

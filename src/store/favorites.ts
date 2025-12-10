import { PlayerModel } from "@src/services/props";
import { AsyncStorageService } from "@src/services/StorageService";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FavoritePlayersStores = {
  favoritePlayers: PlayerModel[];
  addFavoritePlayer: (player: PlayerModel) => void;
  removeFavoritePlayer: (playerId: number) => void;
};

export const useFavoritePlayersStore = create<FavoritePlayersStores>()(
  persist(
    (set, get) => ({
      favoritePlayers: [],
      addFavoritePlayer: (player) =>
        set((state) => ({
          favoritePlayers: [...state.favoritePlayers, player],
        })),
      removeFavoritePlayer: (playerId) =>
        set((state) => ({
          favoritePlayers: state.favoritePlayers.filter(
            (player) => player.profile.account_id !== playerId
          ),
        })),
    }),
    {
      name: "favoritePlayers",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

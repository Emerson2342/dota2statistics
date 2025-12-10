import { create } from "zustand";
import { fetchData } from "../services/api";
import { TEAMS_BASE_URL } from "../constants/player";
import { Team } from "@src/services/props";

type TeamStore = {
  teamsList: Team[];
  loaded: boolean;
  loading: boolean;
  fetchTeams: () => Promise<void>;
};

export const useTeamStore = create<TeamStore>((set, get) => ({
  teamsList: [],
  loaded: false,
  loading: false,

  fetchTeams: async () => {
    if (get().loaded) return;

    set({ loading: true });

    try {
      const res = await fetchData<Team[]>(TEAMS_BASE_URL);
      set({ teamsList: res, loaded: true });
    } catch {
      console.log("Error trying to get List of Teams");
    } finally {
      set({ loading: false });
    }
  },
}));

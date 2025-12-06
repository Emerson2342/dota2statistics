import { create } from "zustand";
import { TeamFightModel } from "../../src/services/props";

export type TeamFightsParams = {
  teamFights: TeamFightModel[] | undefined;
  heroNames: string[];
  radTeamName: string;
  direTeamName: string;
  update: () => Promise<void>;
};

type TeamFightsStore = {
  data: TeamFightsParams | null;
  setData: (data: TeamFightsParams) => void;
};

export const useTeamFightsStore = create<TeamFightsStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LeagueMatches,
  PlayerModel,
  RecentMatches,
  WL,
} from "../services/props";

interface PlayerContextData {
  player: PlayerModel | null;
  setPlayer: Dispatch<SetStateAction<PlayerModel | null>>;
  recentMatches: RecentMatches[] | [];
  setRecentMatches: Dispatch<SetStateAction<RecentMatches[] | []>>;
  heroesPlayedId: number[] | [];
  setHeroesPlayedId: Dispatch<SetStateAction<number[] | []>>;
  proMatches: LeagueMatches[] | [];
  setProMatches: Dispatch<SetStateAction<LeagueMatches[] | []>>;
}

const PlayerContext = createContext<PlayerContextData | undefined>(undefined);
interface PlayerProviderProps {
  children: ReactNode;
}
export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [player, setPlayer] = useState<PlayerModel | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecentMatches[] | []>([]);
  const [heroesPlayedId, setHeroesPlayedId] = useState<number[] | []>([]);
  const [proMatches, setProMatches] = useState<LeagueMatches[] | []>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedPlayerData = await AsyncStorage.getItem("playerData");
        const storedRecentMatches = await AsyncStorage.getItem("recentMatches");
        const storeHeroesPlayedId = await AsyncStorage.getItem(
          "heroesPlayedId"
        );
        const storedProMatches = await AsyncStorage.getItem("proMatches");

        if (storedPlayerData) {
          setPlayer(JSON.parse(storedPlayerData));
        }
        if (storedRecentMatches) {
          setRecentMatches(JSON.parse(storedRecentMatches));
        }
        if (storeHeroesPlayedId) {
          setHeroesPlayedId(JSON.parse(storeHeroesPlayedId));
        }
        if (storedProMatches) {
          setProMatches(JSON.parse(storedProMatches));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("playerData", JSON.stringify(player));
        await AsyncStorage.setItem(
          "recentMatches",
          JSON.stringify(recentMatches)
        );
        await AsyncStorage.setItem(
          "heroesPlayedId",
          JSON.stringify(heroesPlayedId)
        );
        await AsyncStorage.setItem("proMatches", JSON.stringify(proMatches));
      } catch (error) {
        console.error("Erro ao salvar dados no AsyncStorage:", error);
      }
    };

    saveData();
  }, [player, recentMatches, heroesPlayedId, proMatches]);

  const contextValue: PlayerContextData = {
    player,
    recentMatches,
    setPlayer,
    setRecentMatches,
    heroesPlayedId,
    setHeroesPlayedId,
    proMatches,
    setProMatches,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error(
      "usePlayerContext deve ser usado dentro de um PlayerProvider"
    );
  }
  return context;
};

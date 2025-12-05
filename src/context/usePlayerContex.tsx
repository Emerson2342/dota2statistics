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
  HeroesPlayed,
  LeagueMatches,
  PlayerModel,
  RecentMatches,
} from "../services/props";
import { PLAYER_PROFILE_API_BASE_URL } from "../constants/player";
import {
  fetchData,
  getHeroesPlayed,
  getRecentMatches,
} from "../../src/services/api";
import { SetPlayerModel } from "../utils/setPlayer";
import { fail } from "assert";

interface PlayerContextData {
  player: PlayerModel | null;
  heroesPlayedId: number[] | [];
  heroesPlayed: HeroesPlayed[];
  isLoadingContext: boolean;
  recentMatches: RecentMatches[];
  handleFetchPlayerData: (playerId: string | undefined) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextData | undefined>(undefined);
interface PlayerProviderProps {
  children: ReactNode;
}
export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [player, setPlayer] = useState<PlayerModel | null>(null);
  const [heroesPlayedId, setHeroesPlayedId] = useState<number[] | []>([]);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [recentMatches, setRecentMatches] = useState<RecentMatches[] | []>([]);
  const [heroesPlayed, setHeroesPlayed] = useState<HeroesPlayed[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedPlayerData = await AsyncStorage.getItem("playerData");
        const storeHeroesPlayedId = await AsyncStorage.getItem(
          "heroesPlayedId"
        );

        if (storedPlayerData) {
          const parsed = JSON.parse(storedPlayerData);
          setPlayer(parsed);
          handleFetchPlayerData(parsed.profile.account_id.toString());
        }
        if (storeHeroesPlayedId) {
          setHeroesPlayedId(JSON.parse(storeHeroesPlayedId));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage:", error);
      } finally {
        setIsLoadingContext(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!player) return;
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("playerData", JSON.stringify(player));
        await AsyncStorage.setItem(
          "heroesPlayedId",
          JSON.stringify(heroesPlayedId)
        );
      } catch (error) {
        console.error("Erro ao salvar dados no AsyncStorage:", error);
      }
    };
    saveData();
  }, [player, heroesPlayedId]);

  const handleFetchPlayerData = async (playerId: string | undefined) => {
    setIsLoadingContext(true);
    const searchPlayer = `${PLAYER_PROFILE_API_BASE_URL}${playerId}`;
    await fetchData<PlayerModel>(searchPlayer)
      .then(async (res) => {
        if (res) {
          const playerRes = SetPlayerModel(res);
          setPlayer(playerRes);
          const recentMatchesUrl = `${PLAYER_PROFILE_API_BASE_URL}${playerRes.profile.account_id}/recentMatches`;
          await getRecentMatches(
            recentMatchesUrl,
            setHeroesPlayedId,
            setRecentMatches
          );
          const url = `${PLAYER_PROFILE_API_BASE_URL}${playerRes?.profile.account_id}/heroes`;
          const heroesPlayedResponse = await getHeroesPlayed(url);
          if (heroesPlayedResponse && heroesPlayedResponse?.length > 0) {
            setHeroesPlayed(heroesPlayedResponse);
          }
        } else {
          setPlayer(null);
        }
      })
      .catch((error) => {
        console.log("Error trying to get profile", error.message);
        setPlayer(null);
      })
      .finally(() => setIsLoadingContext(false));
  };

  const contextValue: PlayerContextData = {
    player,
    heroesPlayed,
    heroesPlayedId,
    isLoadingContext,
    recentMatches,
    handleFetchPlayerData,
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

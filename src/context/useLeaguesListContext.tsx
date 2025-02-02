import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { League } from "../services/props";

interface LeagueListContextType {
  leagueList: League[] | [];
  setLeagueList: Dispatch<SetStateAction<League[] | []>>;
}

const LeagueListContext = createContext<LeagueListContextType | undefined>(
  undefined
);

export const useLeagueListContext = (): LeagueListContextType => {
  const context = useContext(LeagueListContext);
  if (!context) {
    throw new Error(
      "useTeamsListContext deve ser usado dentro de um ProfileProvider"
    );
  }
  return context;
};

interface LeagueListProviderProps {
  children: ReactNode;
}

export const LeagueListProvider: React.FC<LeagueListProviderProps> = ({
  children,
}) => {
  const [leagueList, setLeagueList] = useState<League[] | []>([]);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedLeagueList = await AsyncStorage.getItem("leagueList");

        if (storedLeagueList !== null) {
          setLeagueList(JSON.parse(storedLeagueList));
        }
      } catch (error) {
        console.error("Erro ao carregar dados armazenados", error);
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    const saveAsyncData = async () => {
      try {
        await AsyncStorage.setItem("leagueList", JSON.stringify(leagueList));
      } catch (error) {
        console.error("Erro ao salvar dados no AsyncStorage:", error);
      }
    };
    saveAsyncData();
  }, [leagueList]);

  return (
    <LeagueListContext.Provider value={{ leagueList, setLeagueList }}>
      {children}
    </LeagueListContext.Provider>
  );
};

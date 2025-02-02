import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { Team } from "../services/props";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TeamsListContextType {
  teamsList: Team[] | [];
  setTeamsList: Dispatch<SetStateAction<Team[]>>;
}

const TeamsListContext = createContext<TeamsListContextType | undefined>(
  undefined
);

export const useTeamsListContext = (): TeamsListContextType => {
  const context = useContext(TeamsListContext);
  if (!context) {
    throw new Error(
      "useTeamsListContext deve ser usado dentro de um ProfileProvider"
    );
  }
  return context;
};

interface TeamsListProviderProps {
  children: ReactNode;
}

export const TeamsListProvider: React.FC<TeamsListProviderProps> = ({
  children,
}) => {
  const [teamsList, setTeamsList] = useState<Team[]>([]);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedTeamsList = await AsyncStorage.getItem("teamsList");

        if (storedTeamsList !== null) {
          setTeamsList(JSON.parse(storedTeamsList));
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
        await AsyncStorage.setItem("teamsList", JSON.stringify(teamsList));
      } catch (error) {
        console.error("Erro ao salvar dados no AsyncStorage:", error);
      }
    };
    saveAsyncData();
  }, [teamsList]);

  return (
    <TeamsListContext.Provider value={{ teamsList, setTeamsList }}>
      {children}
    </TeamsListContext.Provider>
  );
};

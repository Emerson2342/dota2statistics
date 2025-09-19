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
import { fetchData } from "../../src/services/api";
import { TEAMS_BASE_URL } from "../../src/constants/player";

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
    const loadTeamList = async () => {
      await fetchData<Team[]>(TEAMS_BASE_URL)
        .then((res) => setTeamsList(res))
        .catch(() => console.error("Error trying to get List of Teams"));
    };

    loadTeamList();
  }, []);

  return (
    <TeamsListContext.Provider value={{ teamsList, setTeamsList }}>
      {children}
    </TeamsListContext.Provider>
  );
};

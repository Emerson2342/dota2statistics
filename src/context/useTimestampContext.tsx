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

interface TimestampContextType {
  leagueTimestamp: number | null;
  setLeagueTimestamp: Dispatch<SetStateAction<number | null>>;
  playerTimestamp: number | null;
  setPlayerTimestamp: Dispatch<SetStateAction<number | null>>;
  accountTimestamp: number | null;
  setAccountTimestamp: Dispatch<SetStateAction<number | null>>;
}

const TimestampContext = createContext<TimestampContextType | undefined>(
  undefined
);

export const useTimestampContext = (): TimestampContextType => {
  const context = useContext(TimestampContext);
  if (!context) {
    throw new Error(
      "useTimestampContext deve ser usado dentro de um ProfileProvider"
    );
  }
  return context;
};

interface TimestampProviderProps {
  children: ReactNode;
}

export const TimestampProvider: React.FC<TimestampProviderProps> = ({
  children,
}) => {
  const [leagueTimestamp, setLeagueTimestamp] = useState<number | null>(null);
  const [playerTimestamp, setPlayerTimestamp] = useState<number | null>(null);
  const [accountTimestamp, setAccountTimestamp] = useState<number | null>(null);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedLeagueTimestamp = await AsyncStorage.getItem(
          "leagueTimestamp"
        );
        const storedPlayerTimestamp = await AsyncStorage.getItem(
          "playerTimestamp"
        );
        const storedAccountTimestamp = await AsyncStorage.getItem(
          "accountTimestamp"
        );

        if (storedLeagueTimestamp !== null) {
          setLeagueTimestamp(JSON.parse(storedLeagueTimestamp));
        }
        if (storedPlayerTimestamp !== null) {
          setPlayerTimestamp(JSON.parse(storedPlayerTimestamp));
        }
        if (storedAccountTimestamp !== null) {
          setAccountTimestamp(JSON.parse(storedAccountTimestamp));
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
        await AsyncStorage.setItem(
          "leagueTimestamp",
          JSON.stringify(leagueTimestamp)
        );
        await AsyncStorage.setItem(
          "playerTimestamp",
          JSON.stringify(playerTimestamp)
        );
        await AsyncStorage.setItem(
          "accountTimestamp",
          JSON.stringify(accountTimestamp)
        );
      } catch (error) {
        console.error("Erro ao salvar dados no AsyncStorage:", error);
      }
    };
    saveAsyncData();
  }, [leagueTimestamp, playerTimestamp, accountTimestamp]);

  return (
    <TimestampContext.Provider
      value={{
        leagueTimestamp,
        setLeagueTimestamp,
        playerTimestamp,
        setPlayerTimestamp,
        accountTimestamp,
        setAccountTimestamp,
      }}
    >
      {children}
    </TimestampContext.Provider>
  );
};

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

interface RefreshContextType {
  refreshProfile: boolean;
  setRefreshProfile: Dispatch<SetStateAction<boolean>>;
}

const RefreshContext = createContext<RefreshContextType | undefined>(
  undefined
);

export const useRefreshContext = (): RefreshContextType => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error(
      "useRefreshProfileContext deve ser usado dentro de um ProfileProvider"
    );
  }
  return context;
};

interface RefreshProviderProps {
  children: ReactNode;
}

export const RefreshProvider: React.FC<RefreshProviderProps> = ({
  children,
}) => {
  const [refreshProfile, setRefreshProfile] = useState<boolean>(false);

  useEffect(() => {
      const loadStoredData = async () => {
        try {
          const storedRefreshProfile = await AsyncStorage.getItem(
            "refreshProfile"
          );
  
          if (storedRefreshProfile !== null) {
            setRefreshProfile(JSON.parse(storedRefreshProfile));
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
            "refreshProfile",
            JSON.stringify(refreshProfile)
          );
        } catch (error) {
          console.error("Erro ao salvar dados no AsyncStorage:", error);
        }
      };
      saveAsyncData();
     }, [refreshProfile]); 

  return (
    <RefreshContext.Provider
      value={{
        refreshProfile,
        setRefreshProfile,
      }}
    >
      {children}
    </RefreshContext.Provider>
  );
};

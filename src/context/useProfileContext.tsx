import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { User } from "../services/props";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProfileContextType {
  profile: User | null;
  setProfile: Dispatch<SetStateAction<User | null>>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error(
      "useProfileContext deve ser usado dentro de um ProfileProvider"
    );
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem("profile");

        if (storedProfile !== null) {
          setProfile(JSON.parse(storedProfile));
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
        await AsyncStorage.setItem("profile", JSON.stringify(profile));
      } catch (error) {
        console.error("Erro ao salvar dados no AsyncStorage:", error);
      }
    };
    saveAsyncData();
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

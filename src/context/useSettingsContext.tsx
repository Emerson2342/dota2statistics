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

//contexto dos dados
interface SettingsContextData {
  englishLanguage: boolean;
  setEnglishLanguage: Dispatch<SetStateAction<boolean>>;
  globalTheme: string;
  setGlobalTheme: Dispatch<SetStateAction<string>>;
}

//criação do Context
const SettingsContext = createContext<SettingsContextData | undefined>(
  undefined
);

//definição das props do provider
interface SettingsProviderProps {
  children: ReactNode;
}

//criação do provider
export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [englishLanguage, setEnglishLanguage] = useState(true);
  const [globalTheme, setGlobalTheme] = useState("str");

  //carregando dados do AsyncStorage
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem("englishLanguage");
        if (storedLanguage) {
          setEnglishLanguage(JSON.parse(storedLanguage));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage:", error);
      }
    };
    const LoadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("globalTheme");
        if (storedTheme) {
          setGlobalTheme(JSON.parse(storedTheme));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage:", error);
      }
    };

    loadLanguage();
    LoadTheme();
  }, []);

  //salvando dados no AsyncStorage
  useEffect(() => {
    const saveEnglishLanguage = async () => {
      try {
        await AsyncStorage.setItem(
          "englishLanguage",
          JSON.stringify(englishLanguage)
        );
      } catch (error) {
        console.error("Erro ao salvar dados no AsyncStorage:", error);
      }
    };

    const saveIsRadiantTheme = async () => {
      try {
        await AsyncStorage.setItem("globalTheme", JSON.stringify(globalTheme));
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage:", error);
      }
    };

    saveEnglishLanguage();
    saveIsRadiantTheme();
  }, [englishLanguage, globalTheme]); //dependência para o useEffect

  //valor do contexto
  const contextValue: SettingsContextData = {
    englishLanguage,
    setEnglishLanguage,
    globalTheme,
    setGlobalTheme,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

//hook para usar o contexto
export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "useSettingsContext deve ser usado dentro de um SettingsProvider"
    );
  }
  return context;
};

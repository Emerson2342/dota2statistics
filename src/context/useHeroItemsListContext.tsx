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
import { HeroBenchmarksData, HeroItemsListPopularity } from "../services/props";

interface HeroItemsListContextData {
  heroItemsList: HeroItemsListPopularity[] | [];
  setHeroItemsList: Dispatch<SetStateAction<HeroItemsListPopularity[] | []>>;
  heroBenchmarcksList: HeroBenchmarksData[] | [];
  setHeroBenchmarcksList: Dispatch<SetStateAction<HeroBenchmarksData[] | []>>;
}

const HeroItemsListContext = createContext<
  HeroItemsListContextData | undefined
>(undefined);
interface HeroItemsListProviderProps {
  children: ReactNode;
}
export const HeroItemListProvider: React.FC<HeroItemsListProviderProps> = ({
  children,
}) => {
  const [heroItemsList, setHeroItemsList] = useState<
    HeroItemsListPopularity[] | []
  >([]);
  const [heroBenchmarcksList, setHeroBenchmarcksList] = useState<
    HeroBenchmarksData[] | []
  >([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedHeroItemsList = await AsyncStorage.getItem("heroItemsList");
        const storedHeroBenchMarks = await AsyncStorage.getItem(
          "heroBenchmarcksList"
        );

        if (storedHeroItemsList)
          setHeroItemsList(JSON.parse(storedHeroItemsList));

        if (storedHeroBenchMarks)
          setHeroBenchmarcksList(JSON.parse(storedHeroBenchMarks));
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(
          "heroItemsList",
          JSON.stringify(heroItemsList)
        );
        await AsyncStorage.setItem(
          "heroBenchmarcksList",
          JSON.stringify(heroBenchmarcksList)
        );
      } catch (error) {
        console.error("Erro ao salvar dados no AsyncStorage:", error);
      }
    };

    saveData();
  }, [heroItemsList, heroBenchmarcksList]);

  const contextValue: HeroItemsListContextData = {
    heroItemsList,
    setHeroItemsList,
    heroBenchmarcksList,
    setHeroBenchmarcksList,
  };

  return (
    <HeroItemsListContext.Provider value={contextValue}>
      {children}
    </HeroItemsListContext.Provider>
  );
};

export const useHeroItemListContext = () => {
  const context = useContext(HeroItemsListContext);
  if (!context) {
    throw new Error(
      "useHeroItemsListContext deve ser usado dentro de um HeroItemsList"
    );
  }
  return context;
};

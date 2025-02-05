import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";
import { HeroBenchmarksData, HeroItemsListPopularity } from "../services/props";
import { AsyncStorageService } from "../../src/services/StorageService";

const storage = new AsyncStorageService();

interface HeroItemsListContextData {
    heroItemsList: HeroItemsListPopularity[] | [];
    setHeroItemsList: Dispatch<SetStateAction<HeroItemsListPopularity[] | []>>;
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

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedHeroItemsList = await storage.getItem<HeroItemsListPopularity[]>("heroItemsList");


                if (storedHeroItemsList)
                    setHeroItemsList(storedHeroItemsList);

            } catch (error) {
                console.error("Erro ao carregar dados do AsyncStorage:", error);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        const saveData = async () => {
            try {
                await storage.setItem("heroItemsList", (heroItemsList));
            } catch (error) {
                console.error("Erro ao salvar dados no AsyncStorage:", error);
            }
        };

        saveData();
    }, [heroItemsList]);

    const contextValue: HeroItemsListContextData = {
        heroItemsList,
        setHeroItemsList,
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
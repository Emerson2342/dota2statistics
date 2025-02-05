import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";
import { MatchDetailsModel } from "../services/props";
import { AsyncStorageService } from "../../src/services/StorageService";


const storage = new AsyncStorageService();

//contexto dos dados
interface MatchesDetailsListContextData {
    matchesDetailsList: MatchDetailsModel[];
    setMatchesDetailsList: Dispatch<SetStateAction<MatchDetailsModel[]>>;
}

//criação do Context
const MatchesDetailsListContext = createContext<
    MatchesDetailsListContextData | undefined
>(undefined);

//definição das props do provider
interface MactchesDetailsListProviderProps {
    children: ReactNode;
}

//criação do provider
export const MactchesDetailsListProvider: React.FC<
    MactchesDetailsListProviderProps
> = ({ children }) => {
    const [matchesDetailsList, setMatchesDetailsList] = useState<
        MatchDetailsModel[]
    >([]);

    //carregando dados do AsyncStorage
    useEffect(() => {
        const loadMatchesList = async () => {
            try {
                const storedMachesList = await storage.getItem<MatchDetailsModel[]>("matchesDetailsList");
                if (storedMachesList) {
                    setMatchesDetailsList(storedMachesList);
                }
            } catch (error) {
                console.error("Erro ao carregar dados do AsyncStorage:", error);
            }
        };

        loadMatchesList();
    }, []);

    //salvando dados no AsyncStorage
    useEffect(() => {
        const saveMacthesDetailsList = async () => {
            try {
                await storage.setItem("matchesDetailsList", (matchesDetailsList));
            } catch (error) {
                console.error("Erro ao salvar dados no AsyncStorage:", error);
            }
        };

        saveMacthesDetailsList();
    }, [matchesDetailsList]); //dependência para o useEffect

    //valor do contexto
    const contextValue: MatchesDetailsListContextData = {
        matchesDetailsList,
        setMatchesDetailsList,
    };

    return (
        <MatchesDetailsListContext.Provider value={contextValue}>
            {children}
        </MatchesDetailsListContext.Provider>
    );
};

//hook para usar o contexto
export const useMatchesDetailsListContext = () => {
    const context = useContext(MatchesDetailsListContext);
    if (!context) {
        throw new Error(
            "useMatchesDetailsListContext deve ser usado dentro de um FriendsListProvider"
        );
    }
    return context;
};
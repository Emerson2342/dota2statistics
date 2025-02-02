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
import { FriendDetailsModel } from "../services/props";

//interface Friend
/* interface Friend {
    friend: string;
    idFriend: number;
}
 */
//contexto dos dados
interface FriendsListContextData {
    friendsList: FriendDetailsModel[];
    setFriendsList: Dispatch<SetStateAction<FriendDetailsModel[]>>;
    friendDetails: FriendDetailsModel[];
    setFriendDetails: Dispatch<SetStateAction<FriendDetailsModel[]>>;
}

//criação do Context
const FriendsListContext = createContext<FriendsListContextData | undefined>(
    undefined
);

//definição das props do provider
interface FriendsListProviderProps {
    children: ReactNode;
}

//criação do provider
export const FriendsListProvider: React.FC<FriendsListProviderProps> = ({
    children,
}) => {
    const [friendsList, setFriendsList] = useState<FriendDetailsModel[]>([]);
    const [friendDetails, setFriendDetails] = useState<FriendDetailsModel[]>([]);

    //carregando dados do AsyncStorage
    useEffect(() => {
        const loadFriendsList = async () => {
            try {
                const storedFriendsList = await AsyncStorage.getItem("friendsList");
                if (storedFriendsList) {
                    setFriendsList(JSON.parse(storedFriendsList));
                }
            } catch (error) {
                console.error("Erro ao carregar dados do AsyncStorage:", error);
            }
        };
        const loadFriendDetails = async () => {
            try {
                const storedFriendDetails = await AsyncStorage.getItem("friendDetails");
                if (storedFriendDetails) {
                    setFriendDetails(JSON.parse(storedFriendDetails));
                }
            } catch (error) {
                console.error("Erro ao carregar dados do AsyncStorage:", error);
            }
        };

        loadFriendsList();
        loadFriendDetails();
    }, []);

    //salvando dados no AsyncStorage
    useEffect(() => {
        const saveFriendsList = async () => {
            try {
                await AsyncStorage.setItem("friendsList", JSON.stringify(friendsList));
            } catch (error) {
                console.error("Erro ao salvar dados no AsyncStorage:", error);
            }
        };
        const saveFriendDetails = async () => {
            try {
                await AsyncStorage.setItem(
                    "friendDetails",
                    JSON.stringify(friendDetails)
                );
            } catch (error) {
                console.error("Erro ao salvar dados no AsyncStorage:", error);
            }
        };

        saveFriendsList();
        saveFriendDetails();
    }, [friendsList, friendDetails]); //dependência para o useEffect

    //valor do contexto
    const contextValue: FriendsListContextData = {
        friendsList,
        setFriendsList,
        friendDetails,
        setFriendDetails,
    };

    return (
        <FriendsListContext.Provider value={contextValue}>
            {children}
        </FriendsListContext.Provider>
    );
};

//hook para usar o contexto
export const useFriendsListContext = () => {
    const context = useContext(FriendsListContext);
    if (!context) {
        throw new Error(
            "useFriendsListContext deve ser usado dentro de um FriendsListProvider"
        );
    }
    return context;
};

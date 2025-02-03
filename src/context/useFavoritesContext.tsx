import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { FavoritesContextType, PlayerModel } from "../services/props";
import { AsyncStorageService } from "../services/StorageService";

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const useFavoritesPlayersContext = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      "useFavoritesContext deve ser usado dentro de um ProfileProvider"
    );
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favoritesPlayers, setFavoritesPlayers] = useState<PlayerModel[]>([]);

  const addFavoritePlayer = (player: PlayerModel) => {
    setFavoritesPlayers((prevList) => [...prevList, player]);
  };

  const removeFavoritePlayer = (playerId: number) => {
    setFavoritesPlayers((prevList) =>
      prevList.filter((player) => player.profile.account_id != playerId)
    );
  };

  const storageAsync = new AsyncStorageService();

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedFavoritesPlayers = await storageAsync.getItem<
          PlayerModel[]
        >("favoritesPlayers");

        if (storedFavoritesPlayers) {
          setFavoritesPlayers(storedFavoritesPlayers);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar lista de jogadores favoritos armazenados? ",
          error
        );
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    const saveAsyncData = async () => {
      try {
        await storageAsync.setItem("favoritesPlayers", favoritesPlayers);
      } catch (error) {
        console.error(
          "Erro ao salvar lista de jogadores favoritos armazenados: ",
          error
        );
      }
    };
    saveAsyncData();
  }, [favoritesPlayers]);

  return (
    <FavoritesContext.Provider
      value={{ addFavoritePlayer, removeFavoritePlayer, favoritesPlayers }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

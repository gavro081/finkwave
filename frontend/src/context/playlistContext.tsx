import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { BasicPlaylist } from "../utils/types";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/error";
import { useAuth } from "./authContext";
interface PlaylistContextType {
  createdPlaylists: BasicPlaylist[] | undefined;
  setCreatedPlaylists: Dispatch<SetStateAction<BasicPlaylist[] | undefined>>;
  isLoading: boolean;
  refreshPlaylists: (addedSong: boolean) => Promise<void>;
}

interface PlaylistProviderProps {
  children: ReactNode;
}

const PlaylistContext = createContext<PlaylistContextType>({
  createdPlaylists: undefined,
  setCreatedPlaylists: () => {},
  isLoading: false,
  refreshPlaylists: async (addedSong: boolean) => {},
});

const PlaylistProvider = ({ children }: PlaylistProviderProps) => {
  const { user } = useAuth();
  const [createdPlaylists, setCreatedPlaylists] = useState<
    BasicPlaylist[] | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCreatedPlaylists = async (addedSong: boolean) => {
    if (!addedSong) {
      setIsLoading(true);
    }
    try {
      const data = await axiosInstance.get<BasicPlaylist[]>("/playlists/user");
      setCreatedPlaylists(data.data);
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreatedPlaylists(false);
    } else {
      setCreatedPlaylists(undefined);
    }
  }, [user]);

  return (
    <PlaylistContext.Provider
      value={{
        createdPlaylists,
        setCreatedPlaylists,
        isLoading,
        refreshPlaylists: fetchCreatedPlaylists,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const useCreatedPlaylists = () => useContext(PlaylistContext);

export default PlaylistProvider;

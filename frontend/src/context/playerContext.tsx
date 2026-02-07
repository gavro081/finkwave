import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";

export interface PlayerSong {
	id: number;
	title: string;
	artist: string;
	cover?: string | null;
	embedUrl: string;
}

interface PlayerContextType {
	currentSong: PlayerSong | null;
	isMinimized: boolean;
	play: (song: PlayerSong) => void;
	stop: () => void;
	toggleMinimize: () => void;
	isPlaying: boolean;
}

const PlayerContext = createContext<PlayerContextType>({
	currentSong: null,
	isMinimized: false,
	isPlaying: false,
	play: () => {},
	stop: () => {},
	toggleMinimize: () => {},
});

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
	const [currentSong, setCurrentSong] = useState<PlayerSong | null>(null);
	const [isMinimized, setIsMinimized] = useState(true);
	const [isPlaying, setIsPlaying] = useState(false);

	const play = useCallback((song: PlayerSong) => {
		setCurrentSong(song);
		setIsPlaying(true);
	}, []);

	const stop = useCallback(() => {
		setIsPlaying(false);
		setCurrentSong(null);
	}, []);

	const toggleMinimize = useCallback(() => {
		setIsMinimized((prev) => !prev);
	}, []);

	return (
		<PlayerContext.Provider
			value={{
				currentSong,
				isMinimized,
				isPlaying,
				play,
				stop,
				toggleMinimize,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export const usePlayer = () => useContext(PlayerContext);

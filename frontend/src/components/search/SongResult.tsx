import axiosInstance from "../../api/axiosInstance";
import type { Song } from "../../utils/types";
import SongItem from "../SongItem";

interface SongResultProps {
	song: Song;
	/** Propagate like state change upward if needed */
	onLikeToggled?: (songId: number, isLiked: boolean) => void;
}

const SongResult = ({ song, onLikeToggled }: SongResultProps) => {
	const handleLike = async (songId: number) => {
		try {
			const response = await axiosInstance.post(
				`/musical-entity/${songId}/like`,
			);
			onLikeToggled?.(songId, response.data.isLiked);
		} catch (err) {
			console.error("Error toggling like:", err);
		}
	};

	return <SongItem song={song} label="Song" onLikeToggle={handleLike} />;
};

export default SongResult;

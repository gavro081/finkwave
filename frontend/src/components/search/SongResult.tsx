import type { Song } from "../../utils/types";

interface SongResultProps {
	song: Song;
}

const SongResult = ({ song }: SongResultProps) => {
	return (
		<div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
			<img
				src={song.cover || "/favicon.png"}
				alt={song.title}
				className="w-12 h-12 rounded object-cover"
				onError={(e) => {
					(e.target as HTMLImageElement).src = "/favicon.png";
				}}
			/>
			<div className="flex-1 min-w-0">
				<p className="text-white font-medium truncate">{song.title}</p>
				<p className="text-sm text-gray-400 truncate">
					Song • {song.releasedBy}
				</p>
			</div>
			<span className="text-xs text-gray-500 uppercase tracking-wider">
				{song.genre}
			</span>
		</div>
	);
};

export default SongResult;

import { useNavigate } from "react-router-dom";
import { usePlayer } from "../../context/playerContext";
import type { Song } from "../../utils/types";

interface SongResultProps {
	song: Song;
}

const toEmbedUrl = (url: string): string => {
	try {
		const parsed = new URL(url);
		if (
			(parsed.hostname === "www.youtube.com" ||
				parsed.hostname === "youtube.com") &&
			parsed.searchParams.has("v")
		) {
			return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
		}
		if (parsed.hostname === "youtu.be") {
			return `https://www.youtube.com/embed${parsed.pathname}`;
		}
		return url;
	} catch {
		return url;
	}
};

const SongResult = ({ song }: SongResultProps) => {
	const navigate = useNavigate();
	const { play, currentSong } = usePlayer();

	return (
		<div
			onClick={() => navigate(`/songs/${song.id}`)}
			className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
		>
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
			<span className="text-xs text-gray-500 uppercase tracking-wider mr-2">
				{song.genre}
			</span>
			{song.link && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						play({
							id: song.id,
							title: song.title,
							artist: song.releasedBy,
							cover: song.cover,
							embedUrl: toEmbedUrl(song.link!),
						});
					}}
					className={`p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 ${
						currentSong?.id === song.id
							? "bg-white text-[#1db954]"
							: "bg-[#1db954] text-black hover:scale-110"
					}`}
					aria-label={currentSong?.id === song.id ? "Now playing" : "Play song"}
				>
					{currentSong?.id === song.id ? (
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
						</svg>
					) : (
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M8 5v14l11-7z" />
						</svg>
					)}
				</button>
			)}
		</div>
	);
};

export default SongResult;

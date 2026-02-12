import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../api/axiosInstance";
import { usePlayer } from "../context/playerContext";
import { toEmbedUrl } from "../utils/utils";

export interface SongItemData {
	id: number;
	title: string;
	cover?: string | null;
	genre?: string;
	link?: string | null;
	releasedBy?: string;
	isLikedByCurrentUser?: boolean;
}

interface SongItemProps {
	song: SongItemData;
	/** Optional label shown before the artist, e.g. "Song" for search results */
	label?: string;
	/** Optional role badge for artist contributions, e.g. "PERFORMER" */
	role?: string;
	/** Optional index number for playlist/collection views */
	index?: number;
	/** Callback when the like button is clicked */
	onLikeToggle?: (songId: number) => void;
}

const ROLE_COLORS: { [key: string]: string } = {
	COMPOSER: "bg-purple-500/20 text-purple-300",
	PERFORMER: "bg-blue-500/20 text-blue-300",
	PRODUCER: "bg-green-500/20 text-green-300",
	MAIN_VOCAL: "bg-pink-500/20 text-pink-300",
};

const SongItem = ({
	song,
	label,
	role,
	index,
	onLikeToggle,
}: SongItemProps) => {
	const navigate = useNavigate();
	const { play, currentSong } = usePlayer();
	const [playlistOpen, setPlaylistOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const isPlaying = currentSong?.id === song.id;

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setPlaylistOpen(false);
			}
		};
		if (playlistOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [playlistOpen]);

	const handleAddToPlaylist = (playlistName: string) => {
		console.log(`Adding song ${song.id} to ${playlistName}`);
		// TODO: Implement actual API call
		setPlaylistOpen(false);
	};

	const handleCreateNewPlaylist = () => {
		console.log(`Creating new playlist for song ${song.id}`);
		// TODO: Implement actual playlist creation
		setPlaylistOpen(false);
	};

	// Build subtitle
	const subtitleParts: string[] = [];
	if (label) subtitleParts.push(label);
	if (song.releasedBy) subtitleParts.push(song.releasedBy);
	const subtitle = subtitleParts.join(" • ");

	return (
		<div
			onClick={() => navigate(`/songs/${song.id}`)}
			className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
		>
			{/* Optional index */}
			{index != null && (
				<span className="text-gray-500 font-medium w-8 text-center text-sm shrink-0">
					{index}
				</span>
			)}

			{/* Cover */}
			<img
				src={song.cover ? `${baseURL}/${song.cover}` : "/favicon.png"}
				alt={song.title}
				className="w-12 h-12 rounded object-cover shrink-0"
				onError={(e) => {
					(e.target as HTMLImageElement).src = "/favicon.png";
				}}
			/>

			{/* Title & subtitle */}
			<div className="flex-1 min-w-0">
				<p
					className={`font-medium truncate ${
						isPlaying ? "text-[#1db954]" : "text-white"
					}`}
				>
					{song.title}
				</p>
				{subtitle && (
					<p className="text-sm text-gray-400 truncate">{subtitle}</p>
				)}
			</div>

			{/* Role badge (artist contributions) */}
			{role && (
				<span
					className={`px-3 py-1 rounded-full text-xs font-medium hidden sm:block ${
						ROLE_COLORS[role] || "bg-white/10 text-gray-300"
					}`}
				>
					{role.replace("_", " ")}
				</span>
			)}

			{/* Genre */}
			{song.genre && (
				<span className="text-xs text-gray-500 uppercase tracking-wider mr-2 hidden sm:block">
					{song.genre}
				</span>
			)}

			{/* Play button */}
			{song.link && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						play({
							id: song.id,
							title: song.title,
							artist: song.releasedBy || "",
							cover: song.cover,
							embedUrl: toEmbedUrl(song.link!),
						});
					}}
					className={`p-2 rounded-full transition-all cursor-pointer ${
						isPlaying
							? "bg-white text-[#1db954] opacity-100"
							: "bg-[#1db954] text-black hover:scale-110 opacity-0 group-hover:opacity-100"
					}`}
					aria-label={isPlaying ? "Now playing" : "Play song"}
				>
					{isPlaying ? (
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

			{/* Like button */}
			{onLikeToggle && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						onLikeToggle(song.id);
					}}
					className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
					aria-label={song.isLikedByCurrentUser ? "Unlike" : "Like"}
				>
					<svg
						className="w-5 h-5"
						fill={song.isLikedByCurrentUser ? "#ef4444" : "none"}
						stroke={song.isLikedByCurrentUser ? "#ef4444" : "#6b7280"}
						strokeWidth="2"
						viewBox="0 0 24 24"
					>
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
					</svg>
				</button>
			)}

			{/* Three-dot menu */}
			<div className="relative" ref={dropdownRef}>
				<button
					onClick={(e) => {
						e.stopPropagation();
						setPlaylistOpen((prev) => !prev);
					}}
					className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-white"
					aria-label="More options"
				>
					<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<circle cx="12" cy="5" r="1.5" />
						<circle cx="12" cy="12" r="1.5" />
						<circle cx="12" cy="19" r="1.5" />
					</svg>
				</button>

				{playlistOpen && (
					<div className="absolute right-0 bottom-full mb-2 w-48 bg-[#282828] border border-white/10 rounded-lg shadow-lg py-1 z-50">
						<div className="px-3 py-2 text-xs text-gray-400 border-b border-white/10">
							Add to playlist
						</div>
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleAddToPlaylist("Playlist 1");
							}}
							className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
						>
							Playlist 1
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleAddToPlaylist("Playlist 2");
							}}
							className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
						>
							Playlist 2
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleCreateNewPlaylist();
							}}
							className="w-full text-left px-4 py-2 text-sm text-[#1db954] hover:bg-white/10 transition-colors border-t border-white/10 flex items-center gap-2"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4v16m8-8H4"
								/>
							</svg>
							Create new playlist
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default SongItem;

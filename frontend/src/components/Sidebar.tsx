import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/authContext";
import { usePlayer } from "../context/playerContext";
import type { BasicPlaylist, BasicSong, SidebarProps } from "../utils/types";

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

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { play, currentSong } = usePlayer();
	const [recentlyListened, setRecentlyListened] = useState<BasicSong[]>([]);
	const [playlists, setPlaylists] = useState<BasicPlaylist[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await axiosInstance.get<BasicSong[]>("/songs/recent");
				setRecentlyListened(data.data);
			} catch (error) {
				console.error("Error fetching recently listened songs:", error);
				// todo: show toast
			}
			try {
				const data =
					await axiosInstance.get<BasicPlaylist[]>("/playlists/user");
				setPlaylists(data.data);
			} catch (error) {
				console.error("Error fetching playlists:", error);
				// todo: show toast
			}
		};
		if (user) {
			fetchData();
		} else {
			setRecentlyListened([]);
			setPlaylists([]);
		}
	}, [user]);
	return (
		<div
			className={`fixed left-0 top-0 h-full bg-[#121212] border-r border-white/10 transition-transform duration-300 ease-in-out z-40 ${
				isOpen ? "translate-x-0" : "-translate-x-full"
			} w-64 overflow-y-auto`}
		>
			<div className="p-6">
				{/* Sidebar Header */}
				<div className="flex justify-between items-center mb-6 pt-2">
					<h2 className="text-xl font-bold text-white">Library</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white transition-colors"
						aria-label="Close sidebar"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Recently Listened */}
				<div className="mb-8">
					<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
						Recently Played
					</h3>
					<div className="space-y-3">
						{recentlyListened.map((song) => (
							<div
								key={song.id}
								className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group relative"
							>
								<img
									src={song.cover || "/favicon.png"}
									alt={song.title}
									className="w-10 h-10 rounded object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).src = "/favicon.png";
									}}
								/>
								<div className="flex-1 min-w-0">
									<p
										onClick={() => navigate(`/songs/${song.id}`)}
										className="text-sm font-medium text-white truncate hover:underline cursor-pointer"
									>
										{song.title}
									</p>
									<div className="flex items-center gap-1 text-xs text-gray-400">
										<span
											onClick={(e) => {
												e.stopPropagation();
												if (song.artistUsername) {
													navigate(`/users/${song.artistUsername}`);
												}
											}}
											className={`truncate ${
												song.artistUsername
													? "hover:underline cursor-pointer hover:text-white"
													: ""
											}`}
										>
											{song.artist}
										</span>
										{song.album && (
											<>
												<span>•</span>
												<span
													onClick={(e) => {
														e.stopPropagation();
														if (song.albumId) {
															navigate(`/collection/album/${song.albumId}`);
														}
													}}
													className={`truncate ${
														song.albumId
															? "hover:underline cursor-pointer hover:text-white"
															: ""
													}`}
												>
													{song.album}
												</span>
											</>
										)}
									</div>
								</div>
								{song.link && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											play({
												id: song.id,
												title: song.title,
												artist: song.artist,
												cover: song.cover,
												embedUrl: toEmbedUrl(song.link!),
											});
										}}
										className={`p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 ${
											currentSong?.id === song.id
												? "bg-white text-[#1db954]"
												: "bg-[#1db954] text-black hover:scale-110"
										}`}
										aria-label={
											currentSong?.id === song.id ? "Now playing" : "Play song"
										}
									>
										{currentSong?.id === song.id ? (
											<svg
												className="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
											</svg>
										) : (
											<svg
												className="w-4 h-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M8 5v14l11-7z" />
											</svg>
										)}
									</button>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Playlists */}
				<div>
					<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
						Your Playlists
					</h3>
					<div className="space-y-2">
						{playlists.map((playlist) => (
							<div
								key={playlist.id}
								className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
							>
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
										<svg
											className="w-5 h-5 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
										</svg>
									</div>
									<div>
										<p className="text-sm font-medium text-white">
											{playlist.name}
										</p>
										<p className="text-xs text-gray-400">
											{playlist.songCount} songs
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;

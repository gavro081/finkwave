import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import type { Song } from "../utils/types";
import Nav from "./Nav";

const LandingPage = () => {
	const [songs, setSongs] = useState<Song[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

	// mock data for recently listened songs
	const recentlyListened = [
		{ id: 1, title: "Song One", artist: "Artist A", cover: "/favicon.png" },
		{ id: 2, title: "Song Two", artist: "Artist B", cover: "/favicon.png" },
		{ id: 3, title: "Song Three", artist: "Artist C", cover: "/favicon.png" },
		{ id: 4, title: "Song Four", artist: "Artist D", cover: "/favicon.png" },
		{ id: 5, title: "Song Five", artist: "Artist E", cover: "/favicon.png" },
	];

	// mock data for my playlists
	const playlists = [
		{ id: 1, name: "My Favorites", songCount: 25 },
		{ id: 2, name: "Workout Mix", songCount: 18 },
		{ id: 3, name: "Chill Vibes", songCount: 32 },
		{ id: 4, name: "Party Hits", songCount: 45 },
	];

	useEffect(() => {
		const fetchSongs = async () => {
			try {
				const response = await axiosInstance.get("/songs");
				const data = response.data;
				console.log("Fetched songs:", data);
				setSongs(data);
			} catch (error) {
				console.error("Error fetching songs:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchSongs();
	}, []);

	return (
		<>
			<Nav
				isSidebarOpen={isSidebarOpen}
				onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
			/>
			<div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] text-white flex pt-20">
				{/* Sidebar */}
				<div
					className={`fixed left-0 top-0 h-full bg-[#121212] border-r border-white/10 transition-transform duration-300 ease-in-out z-100 ${
						isSidebarOpen ? "translate-x-0" : "-translate-x-full"
					} w-64 overflow-y-auto`}
				>
					<div className="p-6">
						{/* Sidebar Header */}
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-bold text-white">Library</h2>
							<button
								onClick={() => setIsSidebarOpen(false)}
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
										className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
									>
										<img
											src={song.cover}
											alt={song.title}
											className="w-10 h-10 rounded object-cover"
										/>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-white truncate">
												{song.title}
											</p>
											<p className="text-xs text-gray-400 truncate">
												{song.artist}
											</p>
										</div>
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

				{/* Main Content */}
				<div
					className={`flex-1 transition-all duration-300 ${
						isSidebarOpen ? "ml-64" : "ml-0"
					}`}
				>
					<div className="p-8">
						{loading ? (
							<div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
								<div className="w-12 h-12 border-4 border-white/10 border-t-[#1db954] rounded-full animate-spin"></div>
								<p className="text-xl text-gray-400">Loading songs...</p>
							</div>
						) : (
							<div className="max-w-7xl mx-auto">
								<div className="mb-12 pb-6 border-b border-white/10">
									<h1 className="text-5xl font-bold mb-3 pb-1 bg-linear-to-r from-[#1db954] to-[#1ed760] bg-clip-text text-transparent">
										Top Songs
									</h1>
									<p className="text-xl text-gray-400">
										Listen to the newest tracks on FinkWave
									</p>
								</div>
								<div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-8 py-4">
									{songs.map((song) => (
										<div
											key={song.id}
											className="bg-[#282828] rounded-xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl group"
										>
											<div className="relative w-full pt-[100%] overflow-hidden bg-[#181818]">
												<img
													src={song.cover || "/favicon.png"}
													alt={song.title}
													className="absolute top-0 left-0 w-full h-full object-cover"
													onError={(e) => {
														(e.target as HTMLImageElement).src = "/favicon.png";
													}}
												/>
												<div className="absolute top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
													<div className="w-15 h-15 rounded-full bg-[#1db954] flex items-center justify-center text-2xl text-black shadow-[0_4px_12px_rgba(29,185,84,0.5)]">
														▶
													</div>
												</div>
											</div>
											<div className="p-4 flex flex-col items-center">
												<h3 className="text-lg font-semibold mb-2 text-white overflow-hidden text-ellipsis whitespace-nowrap">
													{song.title}
												</h3>
												<p className="text-sm text-gray-400 mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
													{"<album>"}
												</p>
												<p className="text-sm text-gray-400 mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
													{song.releasedBy}
												</p>
												{/* <div className="inline-block bg-[#1db954]/20 px-3 py-1 rounded-xl border border-[#1db954]/40">
													<span className="text-xs text-[#1db954] font-medium uppercase tracking-wider">
														{song.genre}
													</span>
												</div> */}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default LandingPage;

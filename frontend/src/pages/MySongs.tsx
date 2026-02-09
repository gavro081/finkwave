import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/authContext";
import type { CatalogItem } from "../utils/types";

const MySongs = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [artistCatalog, setArtistCatalog] = useState<CatalogItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<"singles" | "albums">("singles");

	useEffect(() => {
		const fetchArtistCatalog = async () => {
			try {
				setLoading(true);
				const response =
					await axiosInstance.get<CatalogItem[]>("/songs/catalog");
				const data = response.data;
				setArtistCatalog(data);
			} catch (error) {
				console.error("Error fetching music:", error);
			} finally {
				setLoading(false);
			}
		};

		if (user?.isArtist) {
			fetchArtistCatalog();
		}
	}, [user]);

	if (!user?.isArtist) {
		return (
			<div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-400 text-xl mb-4">
						You need to be an artist to access this page.
					</p>
					<Link to="/" className="text-[#1db954] hover:underline text-sm">
						← Back to Home
					</Link>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 border-4 border-white/10 border-t-[#1db954] rounded-full animate-spin" />
					<p className="text-gray-400 text-lg">Loading your music…</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] text-white">
			<div className="max-w-6xl mx-auto px-6 py-10">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
					<div>
						<h1 className="text-4xl font-extrabold mb-2">My Music</h1>
						<p className="text-gray-400">Manage your songs and albums</p>
					</div>
					<button
						onClick={() => navigate("/publish")}
						className="flex items-center gap-2 px-6 py-3 bg-[#1db954] text-black rounded-full font-semibold hover:bg-[#1ed760] hover:scale-105 transition-all cursor-pointer"
					>
						<svg
							className="w-5 h-5"
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
						Publish New
					</button>
				</div>

				{/* Tabs */}
				<div className="flex gap-1 mb-8 bg-[#181818] rounded-lg p-1 w-fit">
					<button
						onClick={() => setActiveTab("singles")}
						className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							activeTab === "singles"
								? "bg-[#282828] text-white"
								: "text-gray-400 hover:text-white"
						}`}
					>
						Singles (
						{artistCatalog.filter((item) => item.type === "SONG").length})
					</button>
					<button
						onClick={() => setActiveTab("albums")}
						className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							activeTab === "albums"
								? "bg-[#282828] text-white"
								: "text-gray-400 hover:text-white"
						}`}
					>
						Albums (
						{artistCatalog.filter((item) => item.type === "ALBUM").length})
					</button>
				</div>

				{/* Content */}
				{activeTab === "singles" ? (
					<div className="space-y-2">
						{artistCatalog.filter((item) => item.type === "SONG").length ===
						0 ? (
							<div className="text-center py-16">
								<svg
									className="w-16 h-16 mx-auto text-gray-600 mb-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
									/>
								</svg>
								<p className="text-gray-400 text-lg mb-4">
									You haven't published any singles yet
								</p>
								<button
									onClick={() => navigate("/publish")}
									className="text-[#1db954] hover:underline"
								>
									Publish your first song
								</button>
							</div>
						) : (
							artistCatalog
								.filter((item) => item.type === "SONG")
								.map((song, index) => (
									<div
										key={song.id}
										className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors group"
									>
										<span className="w-8 text-center text-gray-500 text-sm">
											{index + 1}
										</span>
										<img
											src={song.cover || "/favicon.png"}
											alt={song.title}
											className="w-12 h-12 rounded object-cover"
											onError={(e) => {
												(e.target as HTMLImageElement).src = "/favicon.png";
											}}
										/>
										<div className="flex-1 min-w-0">
											<Link
												to={`/songs/${song.id}`}
												className="text-white font-medium hover:underline truncate block"
											>
												{song.title}
											</Link>
											<p className="text-gray-400 text-sm">{song.genre}</p>
										</div>
										<p className="text-gray-400 text-sm">{song.releaseDate}</p>
									</div>
								))
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{artistCatalog.filter((item) => item.type === "ALBUM").length ===
						0 ? (
							<div className="col-span-full text-center py-16">
								<svg
									className="w-16 h-16 mx-auto text-gray-600 mb-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
								<p className="text-gray-400 text-lg mb-4">
									You haven't published any albums yet
								</p>
								<button
									onClick={() => navigate("/publish")}
									className="text-[#1db954] hover:underline"
								>
									Publish your first album
								</button>
							</div>
						) : (
							artistCatalog
								.filter((item) => item.type === "ALBUM")
								.map((album) => (
									<Link
										key={album.id}
										to={`/collection/album/${album.id}`}
										className="bg-[#181818] rounded-xl p-4 hover:bg-[#282828] transition-colors group"
									>
										<div className="relative w-full pt-[100%] rounded-lg overflow-hidden mb-4 bg-[#282828]">
											<img
												src={album.cover || "/favicon.png"}
												alt={album.title}
												className="absolute inset-0 w-full h-full object-cover"
												onError={(e) => {
													(e.target as HTMLImageElement).src = "/favicon.png";
												}}
											/>
											<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
												<div className="w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
													<svg
														className="w-6 h-6 text-black"
														fill="currentColor"
														viewBox="0 0 24 24"
													>
														<path d="M8 5v14l11-7z" />
													</svg>
												</div>
											</div>
										</div>
										<h3 className="font-semibold text-white truncate mb-1">
											{album.title}
										</h3>
										<p className="text-gray-400 text-sm">{album.genre}</p>
										<p className="text-gray-400 text-sm">{album.releaseDate}</p>
									</Link>
								))
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default MySongs;

import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import AlbumResult from "../components/search/AlbumResult";
import SongResult from "../components/search/SongResult";
import UserResult from "../components/search/UserResult";
import type {
	Album,
	BaseNonAdminUser,
	SearchCategory,
	Song,
} from "../utils/types";

const CATEGORIES: { value: SearchCategory; label: string }[] = [
	{ value: "songs", label: "Songs" },
	{ value: "albums", label: "Albums" },
	{ value: "artists", label: "Artists" },
	{ value: "users", label: "Users" },
];

const LandingPage = () => {
	const [songs, setSongs] = useState<Song[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	// search state
	const [searchInput, setSearchInput] = useState("");
	const [activeQuery, setActiveQuery] = useState("");
	const [searchCategory, setSearchCategory] = useState<SearchCategory>("songs");
	const [searchResults, setSearchResults] = useState<unknown[]>([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);

	useEffect(() => {
		const fetchSongs = async () => {
			try {
				const response = await axiosInstance.get("/songs/top");
				setSongs(response.data);
			} catch (error) {
				console.error("Error fetching songs:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchSongs();
	}, []);

	const performSearch = async (query: string, category: SearchCategory) => {
		if (!query.trim()) return;

		setSearchLoading(true);
		setHasSearched(true);
		setActiveQuery(query);
		setSearchCategory(category);

		try {
			let endpoint = "";
			switch (category) {
				case "songs":
					endpoint = `/songs/search?q=${encodeURIComponent(query)}`;
					break;
				case "albums":
					endpoint = `/albums/search?q=${encodeURIComponent(query)}`;
					break;
				case "artists":
					endpoint = `/users/search?type=ARTIST&q=${encodeURIComponent(query)}`;
					break;
				case "users":
					endpoint = `/users/search?type=LISTENER&q=${encodeURIComponent(query)}`;
					break;
			}

			const response = await axiosInstance.get(endpoint);
			setSearchResults(response.data);
		} catch (error) {
			console.error("Search error:", error);
			setSearchResults([]);
		} finally {
			setSearchLoading(false);
		}
	};

	const handleSearch = () => {
		performSearch(searchInput, searchCategory);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const handleCategorySwitch = (category: SearchCategory) => {
		performSearch(activeQuery, category);
	};

	const clearSearch = () => {
		setSearchInput("");
		setActiveQuery("");
		setHasSearched(false);
		setSearchResults([]);
	};

	const renderResults = () => {
		if (searchLoading) {
			return (
				<div className="flex justify-center py-12">
					<div className="w-10 h-10 border-4 border-white/10 border-t-[#1db954] rounded-full animate-spin"></div>
				</div>
			);
		}

		if (searchResults.length === 0) {
			return (
				<div className="text-center py-12 text-gray-400">
					<p className="text-lg">
						No {searchCategory} found for "{activeQuery}"
					</p>
				</div>
			);
		}

		return (
			<div className="divide-y divide-white/5">
				{searchResults.map((result, index) => {
					switch (searchCategory) {
						case "songs":
							return (
								<SongResult key={(result as Song).id} song={result as Song} />
							);
						case "albums":
							return (
								<AlbumResult
									key={(result as Album).id}
									album={result as Album}
								/>
							);
						case "artists":
							return (
								<UserResult
									key={(result as BaseNonAdminUser).username ?? index}
									user={result as BaseNonAdminUser}
									label="Artist"
								/>
							);
						case "users":
							return (
								<UserResult
									key={(result as BaseNonAdminUser).username ?? index}
									user={result as BaseNonAdminUser}
									label="User"
								/>
							);
					}
				})}
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] text-white flex">
			<div className="flex-1">
				<div className="p-8">
					<div className="max-w-7xl mx-auto">
						{/* Search Bar */}
						<div className="mb-8 flex flex-col md:flex-row gap-3">
							<div className="flex flex-1 gap-0">
								{/* Category Dropdown */}
								<select
									value={searchCategory}
									onChange={(e) =>
										setSearchCategory(e.target.value as SearchCategory)
									}
									className="bg-[#282828] border border-white/10 border-r-0 rounded-l-full py-2 px-4 text-white text-sm focus:outline-none focus:border-[#1db954] appearance-none cursor-pointer"
								>
									{CATEGORIES.map((cat) => (
										<option key={cat.value} value={cat.value}>
											{cat.label}
										</option>
									))}
								</select>

								{/* Search Input */}
								<input
									type="text"
									placeholder={`Search ${searchCategory}...`}
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									onKeyDown={handleKeyDown}
									className="flex-1 bg-[#282828] border border-white/10 border-r-0 py-2 px-4 text-white focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
								/>

								{/* Search Button */}
								<button
									onClick={handleSearch}
									className="bg-[#1db954] hover:bg-[#1ed760] text-black font-medium px-6 rounded-r-full transition-colors flex items-center gap-2"
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
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
									<span className="hidden sm:inline">Search</span>
								</button>
							</div>
						</div>

						{/* Search Results Section */}
						{hasSearched ? (
							<div>
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-2xl font-bold text-white">
										Results for "{activeQuery}"
									</h2>
									<button
										onClick={clearSearch}
										className="text-sm text-gray-400 hover:text-white transition-colors"
									>
										Clear search
									</button>
								</div>

								{/* Quick category switch buttons */}
								<div className="flex gap-2 mb-6">
									{CATEGORIES.map((cat) => (
										<button
											key={cat.value}
											onClick={() => handleCategorySwitch(cat.value)}
											className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
												searchCategory === cat.value
													? "bg-[#1db954] text-black"
													: "bg-white/10 text-white hover:bg-white/20"
											}`}
										>
											{cat.label}
										</button>
									))}
								</div>

								{/* Results list */}
								<div className="bg-[#1a1a2e]/50 rounded-xl overflow-hidden">
									{renderResults()}
								</div>
							</div>
						) : (
							/* Default song grid */
							<>
								<div className="mb-8 border-b border-white/10 pb-6">
									<h1 className="text-5xl font-bold mb-3 pb-1 bg-linear-to-r from-[#1db954] to-[#1ed760] bg-clip-text text-transparent">
										Top Songs
									</h1>
									<p className="text-xl text-gray-400">
										Listen to the newest tracks on FinkWave
									</p>
								</div>

								{loading ? (
									<div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
										<div className="w-12 h-12 border-4 border-white/10 border-t-[#1db954] rounded-full animate-spin"></div>
										<p className="text-xl text-gray-400">Loading songs...</p>
									</div>
								) : (
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
															(e.target as HTMLImageElement).src =
																"/favicon.png";
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
												</div>
											</div>
										))}
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LandingPage;

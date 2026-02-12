import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/authContext";
import { GENRE_OPTIONS, ROLE_OPTIONS } from "../utils/consts";
import type {
	ArtistSearchResult,
	Contributor,
	SongEntry,
} from "../utils/types";

const MAX_CONTRIBUTORS = 5;
const MAX_ALBUM_SONGS = 20;

const PublishSong = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	// Form state
	const [releaseType, setReleaseType] = useState<"single" | "album">("single");
	const [title, setTitle] = useState("");
	const [genre, setGenre] = useState("");
	const [link, setLink] = useState("");
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [coverPreview, setCoverPreview] = useState<string | null>(null);
	const [contributors, setContributors] = useState<Contributor[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Album-specific state
	const [albumSongs, setAlbumSongs] = useState<SongEntry[]>([
		{ title: "", link: "", contributors: [] },
	]);

	// Contributor search state
	const [contributorSearch, setContributorSearch] = useState("");
	const [searchResults, setSearchResults] = useState<ArtistSearchResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showSearchDropdown, setShowSearchDropdown] = useState(false);
	const [selectedContributorRole, setSelectedContributorRole] = useState(
		ROLE_OPTIONS[0].value,
	);
	const searchDropdownRef = useRef<HTMLDivElement>(null);
	const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Album song contributor search state
	const [albumSongContributorSearch, setAlbumSongContributorSearch] = useState<{
		[key: number]: string;
	}>({});
	const [albumSongSearchResults, setAlbumSongSearchResults] = useState<{
		[key: number]: ArtistSearchResult[];
	}>({});
	const [albumSongShowDropdown, setAlbumSongShowDropdown] = useState<{
		[key: number]: boolean;
	}>({});
	const [albumSongSelectedRole, setAlbumSongSelectedRole] = useState<{
		[key: number]: string;
	}>({});

	// Cleanup cover preview URL on unmount
	useEffect(() => {
		return () => {
			if (coverPreview) {
				URL.revokeObjectURL(coverPreview);
			}
		};
	}, [coverPreview]);

	// Click outside handler for search dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchDropdownRef.current &&
				!searchDropdownRef.current.contains(event.target as Node)
			) {
				setShowSearchDropdown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Search for artists (mock implementation)
	const searchArtists = useCallback(async (query: string) => {
		if (!query.trim()) {
			setSearchResults([]);
			return;
		}

		setIsSearching(true);
		try {
			const response = await axiosInstance.get(
				`/users/search?type=ARTIST&q=${encodeURIComponent(query)}&limit=5`,
			);
			const filtered = response.data.filter(
				(artist: ArtistSearchResult) =>
					artist.fullName.toLowerCase().includes(query.toLowerCase()) ||
					artist.username.toLowerCase().includes(query.toLowerCase()),
			);
			setSearchResults(filtered);
		} catch (error) {
			console.error("Error searching artists:", error);
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	}, []);

	// Debounced search
	const handleContributorSearchChange = (value: string) => {
		setContributorSearch(value);
		setShowSearchDropdown(true);

		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		searchTimeoutRef.current = setTimeout(() => {
			searchArtists(value);
		}, 300);
	};

	// Add contributor
	const handleAddContributor = (artist: ArtistSearchResult) => {
		if (contributors.length >= MAX_CONTRIBUTORS) {
			toast.error(`Maximum ${MAX_CONTRIBUTORS} contributors allowed`);
			return;
		}

		if (contributors.some((c) => c.id === artist.id)) {
			toast.error("This contributor is already added");
			return;
		}

		setContributors([
			...contributors,
			{
				id: artist.id,
				fullName: artist.fullName,
				role: selectedContributorRole,
			},
		]);
		setContributorSearch("");
		setSearchResults([]);
		setShowSearchDropdown(false);
	};

	// Remove contributor
	const handleRemoveContributor = (id: number) => {
		setContributors(contributors.filter((c) => c.id !== id));
	};

	// Handle cover file
	const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 2 * 1024 * 1024) {
				toast.error("Max file size is 5MB");
				return;
			}
			if (!file.type.startsWith("image/")) {
				toast.error("Only images allowed");
				return;
			}
			if (coverPreview) {
				URL.revokeObjectURL(coverPreview);
			}
			setCoverFile(file);
			setCoverPreview(URL.createObjectURL(file));
		}
	};

	const handleRemoveCover = () => {
		if (coverPreview) {
			URL.revokeObjectURL(coverPreview);
		}
		setCoverFile(null);
		setCoverPreview(null);
	};

	// Album song handlers
	const handleAddAlbumSong = () => {
		if (albumSongs.length >= MAX_ALBUM_SONGS) {
			toast.error(`Maximum ${MAX_ALBUM_SONGS} songs per album`);
			return;
		}
		setAlbumSongs([...albumSongs, { title: "", link: "", contributors: [] }]);
	};

	const handleRemoveAlbumSong = (index: number) => {
		if (albumSongs.length === 1) {
			toast.error("Album must have at least one song");
			return;
		}
		setAlbumSongs(albumSongs.filter((_, i) => i !== index));
	};

	const handleAlbumSongChange = (
		index: number,
		field: keyof SongEntry,
		value: string | Contributor[],
	) => {
		const updated = [...albumSongs];
		updated[index] = { ...updated[index], [field]: value };
		setAlbumSongs(updated);
	};

	// Album song contributor search
	const handleAlbumSongContributorSearch = useCallback(
		async (index: number, query: string) => {
			setAlbumSongContributorSearch((prev) => ({ ...prev, [index]: query }));
			setAlbumSongShowDropdown((prev) => ({ ...prev, [index]: true }));

			if (!query.trim()) {
				setAlbumSongSearchResults((prev) => ({ ...prev, [index]: [] }));
				return;
			}

			// TODO: replace with api call
			const response = await axiosInstance.get(
				`/users/search?type=ARTIST&q=${encodeURIComponent(query)}&limit=5`,
			);
			const filtered = response.data.filter(
				(artist: ArtistSearchResult) =>
					artist.fullName.toLowerCase().includes(query.toLowerCase()) ||
					artist.username.toLowerCase().includes(query.toLowerCase()),
			);
			setAlbumSongSearchResults((prev) => ({ ...prev, [index]: filtered }));
		},
		[],
	);

	const handleAddAlbumSongContributor = (
		songIndex: number,
		artist: ArtistSearchResult,
	) => {
		const song = albumSongs[songIndex];
		if (song.contributors.length >= MAX_CONTRIBUTORS) {
			toast.error(`Maximum ${MAX_CONTRIBUTORS} contributors per song`);
			return;
		}

		if (song.contributors.some((c) => c.id === artist.id)) {
			toast.error("This contributor is already added");
			return;
		}

		const role = albumSongSelectedRole[songIndex] || ROLE_OPTIONS[0].value;
		const newContributor: Contributor = {
			id: artist.id,
			fullName: artist.fullName,
			role,
		};

		handleAlbumSongChange(songIndex, "contributors", [
			...song.contributors,
			newContributor,
		]);
		setAlbumSongContributorSearch((prev) => ({ ...prev, [songIndex]: "" }));
		setAlbumSongSearchResults((prev) => ({ ...prev, [songIndex]: [] }));
		setAlbumSongShowDropdown((prev) => ({ ...prev, [songIndex]: false }));
	};

	const handleRemoveAlbumSongContributor = (songIndex: number, id: number) => {
		const song = albumSongs[songIndex];
		handleAlbumSongChange(
			songIndex,
			"contributors",
			song.contributors.filter((c) => c.id !== id),
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) {
			toast.error("Please enter a title");
			return;
		}
		if (!genre) {
			toast.error("Please select a genre");
			return;
		}

		if (releaseType === "single") {
			if (!link.trim()) {
				toast.error("Please enter a song link");
				return;
			}
		} else {
			for (let i = 0; i < albumSongs.length; i++) {
				if (!albumSongs[i].title.trim()) {
					toast.error(`Please enter a title for song ${i + 1}`);
					return;
				}
				if (!albumSongs[i].link.trim()) {
					toast.error(`Please enter a link for song ${i + 1}`);
					return;
				}
			}
		}

		setIsSubmitting(true);

		try {
			const formData = new FormData();
			formData.append("title", title);
			formData.append("genre", genre);
			if (coverFile) formData.append("cover", coverFile);

			// Helper to append contributors in indexed format for Spring @ModelAttribute
			const appendContributors = (
				formData: FormData,
				contributors: Contributor[],
				prefix: string,
			) => {
				contributors.forEach((c, i) => {
					formData.append(`${prefix}[${i}].id`, c.id.toString());
					formData.append(`${prefix}[${i}].artistName`, c.fullName);
					formData.append(`${prefix}[${i}].role`, c.role);
				});
			};

			if (releaseType === "album") {
				// Append album songs in indexed format
				albumSongs.forEach((song, songIndex) => {
					formData.append(`albumSongs[${songIndex}].title`, song.title);
					formData.append(`albumSongs[${songIndex}].link`, song.link);
					// Append nested contributors for each song
					song.contributors.forEach((c, contribIndex) => {
						formData.append(
							`albumSongs[${songIndex}].contributors[${contribIndex}].id`,
							c.id.toString(),
						);
						formData.append(
							`albumSongs[${songIndex}].contributors[${contribIndex}].artistName`,
							c.fullName,
						);
						formData.append(
							`albumSongs[${songIndex}].contributors[${contribIndex}].role`,
							c.role,
						);
					});
				});
				await axiosInstance.post("/musical-entity/publish/album", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
			} else {
				formData.append("link", link);
				appendContributors(formData, contributors, "contributors");
				await axiosInstance.post("/musical-entity/publish/song", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
			}

			toast.success(
				releaseType === "single"
					? "Song published successfully!"
					: "Album published successfully!",
			);
			navigate("/my-songs");
		} catch (error) {
			console.error("Error publishing:", error);
			toast.error("Failed to publish. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!user?.isArtist) {
		return (
			<div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-400 text-xl mb-4">
						You need to be an artist to publish music.
					</p>
					<Link to="/" className="text-[#1db954] hover:underline text-sm">
						← Back to Home
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] text-white">
			<div className="max-w-3xl mx-auto px-6 py-10">
				{/* Back link */}
				<Link
					to="/my-songs"
					className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
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
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Back to My Songs
				</Link>

				{/* Header */}
				<h1 className="text-4xl font-extrabold mb-8">Publish New Music</h1>

				<form onSubmit={handleSubmit} className="space-y-8">
					{/* Release Type Selection */}
					<div className="bg-[#181818] rounded-xl p-6">
						<h2 className="text-lg font-semibold mb-4">
							What are you releasing?
						</h2>
						<div className="flex gap-4">
							<label
								className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
									releaseType === "single"
										? "border-[#1db954] bg-[#1db954]/10"
										: "border-white/10 hover:border-white/20"
								}`}
							>
								<input
									type="radio"
									name="releaseType"
									value="single"
									checked={releaseType === "single"}
									onChange={() => setReleaseType("single")}
									className="hidden"
								/>
								<svg
									className={`w-8 h-8 ${releaseType === "single" ? "text-[#1db954]" : "text-gray-400"}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
									/>
								</svg>
								<div>
									<p className="font-medium">Single</p>
									<p className="text-sm text-gray-400">One song</p>
								</div>
							</label>

							<label
								className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
									releaseType === "album"
										? "border-[#1db954] bg-[#1db954]/10"
										: "border-white/10 hover:border-white/20"
								}`}
							>
								<input
									type="radio"
									name="releaseType"
									value="album"
									checked={releaseType === "album"}
									onChange={() => setReleaseType("album")}
									className="hidden"
								/>
								<svg
									className={`w-8 h-8 ${releaseType === "album" ? "text-[#1db954]" : "text-gray-400"}`}
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
								<div>
									<p className="font-medium">Album</p>
									<p className="text-sm text-gray-400">Multiple songs</p>
								</div>
							</label>
						</div>
					</div>

					{/* Basic Info */}
					<div className="bg-[#181818] rounded-xl p-6 space-y-6">
						<h2 className="text-lg font-semibold">
							{releaseType === "single" ? "Song Details" : "Album Details"}
						</h2>

						{/* Title */}
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-300 mb-2"
							>
								{releaseType === "single" ? "Song Title" : "Album Name"} *
							</label>
							<input
								type="text"
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder={
									releaseType === "single"
										? "Enter song title"
										: "Enter album name"
								}
								className="w-full bg-[#282828] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
							/>
						</div>

						{/* Genre */}
						<div>
							<label
								htmlFor="genre"
								className="block text-sm font-medium text-gray-300 mb-2"
							>
								Genre *
							</label>
							<select
								id="genre"
								value={genre}
								onChange={(e) => setGenre(e.target.value)}
								className="w-full bg-[#282828] border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all appearance-none cursor-pointer"
							>
								<option value="">Select a genre</option>
								{GENRE_OPTIONS.map((g) => (
									<option key={g} value={g}>
										{g}
									</option>
								))}
							</select>
						</div>

						{/* Cover Art */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Cover Art (optional)
							</label>
							<div className="flex items-start gap-4">
								{coverPreview ? (
									<div className="relative">
										<img
											src={coverPreview}
											alt="Cover preview"
											className="w-32 h-32 rounded-lg object-cover"
										/>
										<button
											type="button"
											onClick={handleRemoveCover}
											className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
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
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</button>
									</div>
								) : (
									<label
										htmlFor="cover"
										className="w-32 h-32 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#1db954] transition-colors"
									>
										<svg
											className="w-8 h-8 text-gray-400 mb-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
										<span className="text-xs text-gray-400">Upload</span>
									</label>
								)}
								<input
									type="file"
									id="cover"
									accept="image/*"
									onChange={handleCoverChange}
									className="hidden"
								/>
								<div className="text-sm text-gray-400">
									<p>Recommended: 1400x1400px</p>
									<p>Max size: 5MB</p>
									<p>JPG, PNG, or WebP</p>
								</div>
							</div>
						</div>

						{/* Single: Link */}
						{releaseType === "single" && (
							<div>
								<label
									htmlFor="link"
									className="block text-sm font-medium text-gray-300 mb-2"
								>
									Song Link (YouTube) *
								</label>
								<input
									type="url"
									id="link"
									value={link}
									onChange={(e) => setLink(e.target.value)}
									placeholder="https://www.youtube.com/watch?v=..."
									className="w-full bg-[#282828] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
								/>
							</div>
						)}
					</div>

					{/* Single: Contributors */}
					{releaseType === "single" && (
						<div className="bg-[#181818] rounded-xl p-6 space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold">
									Contributors (optional)
								</h2>
								<span className="text-sm text-gray-400">
									{contributors.length}/{MAX_CONTRIBUTORS}
								</span>
							</div>

							{/* Added contributors */}
							{contributors.length > 0 && (
								<div className="flex flex-wrap gap-2 mb-4">
									{contributors.map((contributor) => (
										<div
											key={contributor.id}
											className="flex items-center gap-2 bg-[#282828] rounded-full py-1.5 px-3"
										>
											<span className="text-sm">{contributor.fullName}</span>
											<span className="text-xs text-gray-400">
												(
												{
													ROLE_OPTIONS.find((r) => r.value === contributor.role)
														?.label
												}
												)
											</span>
											<button
												type="button"
												onClick={() => handleRemoveContributor(contributor.id)}
												className="text-gray-400 hover:text-red-400 transition-colors"
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
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</button>
										</div>
									))}
								</div>
							)}

							{/* Add contributor */}
							{contributors.length < MAX_CONTRIBUTORS && (
								<div className="flex gap-3">
									<select
										value={selectedContributorRole}
										onChange={(e) => setSelectedContributorRole(e.target.value)}
										className="bg-[#282828] border border-white/10 rounded-lg py-2.5 px-3 text-white text-sm focus:outline-none focus:border-[#1db954] appearance-none cursor-pointer"
									>
										{ROLE_OPTIONS.map((role) => (
											<option key={role.value} value={role.value}>
												{role.label}
											</option>
										))}
									</select>

									<div className="flex-1 relative" ref={searchDropdownRef}>
										<input
											type="text"
											value={contributorSearch}
											onChange={(e) =>
												handleContributorSearchChange(e.target.value)
											}
											onFocus={() => setShowSearchDropdown(true)}
											placeholder="Search for an artist..."
											className="w-full bg-[#282828] border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
										/>

										{/* Search dropdown */}
										{showSearchDropdown && contributorSearch && (
											<div className="absolute top-full left-0 right-0 mt-1 bg-[#282828] border border-white/10 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
												{isSearching ? (
													<div className="p-3 text-center text-gray-400">
														<div className="w-5 h-5 border-2 border-white/10 border-t-[#1db954] rounded-full animate-spin mx-auto" />
													</div>
												) : searchResults.length > 0 ? (
													searchResults.map((artist) => (
														<button
															key={artist.id}
															type="button"
															onClick={() => handleAddContributor(artist)}
															className="w-full text-left px-4 py-2.5 hover:bg-white/10 transition-colors flex items-center gap-3"
														>
															<div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
																{artist.profilePhoto ? (
																	<img
																		src={artist.profilePhoto}
																		alt={artist.fullName}
																		className="w-full h-full rounded-full object-cover"
																	/>
																) : (
																	<span className="text-xs">
																		{artist.fullName.charAt(0).toUpperCase()}
																	</span>
																)}
															</div>
															<div>
																<p className="text-sm font-medium">
																	{artist.fullName}
																</p>
																<p className="text-xs text-gray-400">
																	@{artist.username}
																</p>
															</div>
														</button>
													))
												) : (
													<div className="p-3 text-center text-gray-400 text-sm">
														No artists found
													</div>
												)}
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					)}

					{/* Album: Songs */}
					{releaseType === "album" && (
						<div className="bg-[#181818] rounded-xl p-6 space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold">Album Songs</h2>
								<span className="text-sm text-gray-400">
									{albumSongs.length}/{MAX_ALBUM_SONGS} songs
								</span>
							</div>

							{albumSongs.map((song, index) => (
								<div
									key={index}
									className="bg-[#282828] rounded-lg p-4 space-y-4"
								>
									<div className="flex items-center justify-between">
										<h3 className="font-medium text-gray-300">
											Song {index + 1}
										</h3>
										{albumSongs.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveAlbumSong(index)}
												className="text-gray-400 hover:text-red-400 transition-colors"
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
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</svg>
											</button>
										)}
									</div>

									{/* Song title */}
									<input
										type="text"
										value={song.title}
										onChange={(e) =>
											handleAlbumSongChange(index, "title", e.target.value)
										}
										placeholder="Song title"
										className="w-full bg-[#1a1a2e] border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
									/>

									{/* Song link */}
									<input
										type="url"
										value={song.link}
										onChange={(e) =>
											handleAlbumSongChange(index, "link", e.target.value)
										}
										placeholder="Song link (YouTube)"
										className="w-full bg-[#1a1a2e] border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
									/>

									{/* Contributors */}
									<div>
										<div className="flex items-center justify-between mb-2">
											<label className="text-sm text-gray-400">
												Contributors (optional)
											</label>
											<span className="text-xs text-gray-500">
												{song.contributors.length}/{MAX_CONTRIBUTORS}
											</span>
										</div>

										{/* Added contributors */}
										{song.contributors.length > 0 && (
											<div className="flex flex-wrap gap-2 mb-3">
												{song.contributors.map((contributor) => (
													<div
														key={contributor.id}
														className="flex items-center gap-2 bg-[#1a1a2e] rounded-full py-1 px-2.5 text-sm"
													>
														<span>{contributor.fullName}</span>
														<span className="text-xs text-gray-400">
															(
															{
																ROLE_OPTIONS.find(
																	(r) => r.value === contributor.role,
																)?.label
															}
															)
														</span>
														<button
															type="button"
															onClick={() =>
																handleRemoveAlbumSongContributor(
																	index,
																	contributor.id,
																)
															}
															className="text-gray-400 hover:text-red-400 transition-colors"
														>
															<svg
																className="w-3.5 h-3.5"
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
												))}
											</div>
										)}

										{/* Add contributor */}
										{song.contributors.length < MAX_CONTRIBUTORS && (
											<div className="flex gap-2">
												<select
													value={
														albumSongSelectedRole[index] ||
														ROLE_OPTIONS[0].value
													}
													onChange={(e) =>
														setAlbumSongSelectedRole((prev) => ({
															...prev,
															[index]: e.target.value,
														}))
													}
													className="bg-[#1a1a2e] border border-white/10 rounded-lg py-2 px-2.5 text-white text-sm focus:outline-none focus:border-[#1db954] appearance-none cursor-pointer"
												>
													{ROLE_OPTIONS.map((role) => (
														<option key={role.value} value={role.value}>
															{role.label}
														</option>
													))}
												</select>

												<div className="flex-1 relative">
													<input
														type="text"
														value={albumSongContributorSearch[index] || ""}
														onChange={(e) =>
															handleAlbumSongContributorSearch(
																index,
																e.target.value,
															)
														}
														onFocus={() =>
															setAlbumSongShowDropdown((prev) => ({
																...prev,
																[index]: true,
															}))
														}
														placeholder="Search artist..."
														className="w-full bg-[#1a1a2e] border border-white/10 rounded-lg py-2 px-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#1db954] transition-all"
													/>

													{/* Dropdown */}
													{albumSongShowDropdown[index] &&
														albumSongContributorSearch[index] && (
															<div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl z-10 max-h-40 overflow-y-auto">
																{(albumSongSearchResults[index] || []).length >
																0 ? (
																	albumSongSearchResults[index].map(
																		(artist) => (
																			<button
																				key={artist.id}
																				type="button"
																				onClick={() =>
																					handleAddAlbumSongContributor(
																						index,
																						artist,
																					)
																				}
																				className="w-full text-left px-3 py-2 hover:bg-white/10 transition-colors flex items-center gap-2"
																			>
																				<div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">
																					{artist.fullName
																						.charAt(0)
																						.toUpperCase()}
																				</div>
																				<span className="text-sm">
																					{artist.fullName}
																				</span>
																			</button>
																		),
																	)
																) : (
																	<div className="p-2 text-center text-gray-400 text-sm">
																		No artists found
																	</div>
																)}
															</div>
														)}
												</div>
											</div>
										)}
									</div>
								</div>
							))}

							{/* Add song button */}
							{albumSongs.length < MAX_ALBUM_SONGS && (
								<button
									type="button"
									onClick={handleAddAlbumSong}
									className="w-full py-3 border-2 border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-[#1db954] transition-all flex items-center justify-center gap-2"
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
									Add Another Song
								</button>
							)}
						</div>
					)}

					{/* Submit */}
					<div className="flex gap-4">
						<button
							type="button"
							onClick={() => navigate("/my-songs")}
							className="flex-1 py-3 px-6 border border-white/20 rounded-full text-white font-semibold hover:bg-white/5 transition-colors cursor-pointer"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="flex-1 py-3 px-6 bg-[#1db954] rounded-full text-black font-semibold hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
						>
							{isSubmitting ? (
								<>
									<div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
									Publishing...
								</>
							) : (
								<>
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
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
										/>
									</svg>
									Publish {releaseType === "single" ? "Song" : "Album"}
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PublishSong;

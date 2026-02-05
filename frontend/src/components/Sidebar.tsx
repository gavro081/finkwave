interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
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
	);
};

export default Sidebar;

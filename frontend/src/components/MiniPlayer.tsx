import { usePlayer } from "../context/playerContext";

const MiniPlayer = () => {
	const { currentSong, isMinimized, stop, toggleMinimize } = usePlayer();

	if (!currentSong) return null;

	return (
		<>
			{/* Fullscreen overlay - only visible when not minimized */}
			<div
				className={`fixed inset-0 z-100 bg-[#0a0a0f] flex flex-col transition-opacity duration-300 ${
					isMinimized
						? "opacity-0 pointer-events-none"
						: "opacity-100 pointer-events-auto"
				}`}
			>
				{/* Header bar */}
				<div className="flex items-center justify-between px-6 py-4 bg-[#1a1a2e]/80 backdrop-blur-sm">
					<div className="flex items-center gap-4">
						<img
							src={currentSong.cover || "/favicon.png"}
							alt={currentSong.title}
							className="w-12 h-12 rounded-lg object-cover shadow-lg"
							onError={(e) => {
								(e.target as HTMLImageElement).src = "/favicon.png";
							}}
						/>
						<div>
							<p className="text-white font-semibold text-lg">
								{currentSong.title}
							</p>
							<p className="text-gray-400 text-sm">{currentSong.artist}</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{/* Minimize */}
						<button
							onClick={toggleMinimize}
							className="text-gray-400 hover:text-white p-2.5 rounded-full hover:bg-white/10 transition-all"
							aria-label="Minimize player"
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
									d="M19 14l-7 7m0 0l-7-7m7 7V3"
								/>
							</svg>
						</button>

						{/* Close */}
						<button
							onClick={stop}
							className="text-gray-400 hover:text-red-400 p-2.5 rounded-full hover:bg-white/10 transition-all"
							aria-label="Close player"
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
				</div>

				{/* Video container - visible only in fullscreen */}
				<div className="flex-1 flex items-center justify-center p-4">
					<div
						className={`w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl ${
							isMinimized ? "invisible" : "visible"
						}`}
					>
						{/* Single iframe - always mounted to preserve playback state */}
						<iframe
							key={currentSong.embedUrl}
							src={`${currentSong.embedUrl}?autoplay=1`}
							title={currentSong.title}
							className="w-full h-full"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					</div>
				</div>
			</div>

			{/* Minimized bar - always visible at bottom */}
			<div
				className={`fixed bottom-0 left-0 right-0 z-100 h-16 bg-[#1a1a2e] border-t border-white/10 shadow-lg transition-transform duration-300 ${
					isMinimized ? "translate-y-0" : "translate-y-full"
				}`}
			>
				<div className="flex items-center justify-between px-4 h-full max-w-7xl mx-auto">
					{/* Song info */}
					<div className="flex items-center gap-3 min-w-0 flex-1">
						<img
							src={currentSong.cover || "/favicon.png"}
							alt={currentSong.title}
							className="w-10 h-10 rounded object-cover shrink-0"
							onError={(e) => {
								(e.target as HTMLImageElement).src = "/favicon.png";
							}}
						/>
						<div className="min-w-0">
							<p className="text-white text-sm font-medium truncate">
								{currentSong.title}
							</p>
							<p className="text-gray-400 text-xs truncate">
								{currentSong.artist}
							</p>
						</div>
					</div>

					{/* Now playing indicator */}
					<div className="hidden sm:flex items-center gap-1.5 px-4">
						<div className="flex items-end gap-0.5 h-4">
							<div
								className="w-1 bg-[#1db954] rounded-full animate-[bounce_0.6s_ease-in-out_infinite]"
								style={{ height: "60%" }}
							/>
							<div
								className="w-1 bg-[#1db954] rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.1s]"
								style={{ height: "100%" }}
							/>
							<div
								className="w-1 bg-[#1db954] rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.2s]"
								style={{ height: "40%" }}
							/>
							<div
								className="w-1 bg-[#1db954] rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.3s]"
								style={{ height: "80%" }}
							/>
						</div>
						<span className="text-[#1db954] text-xs font-medium ml-1">
							Playing
						</span>
					</div>

					{/* Controls */}
					<div className="flex items-center gap-1">
						{/* Expand - shows fullscreen to allow seeking */}
						<button
							onClick={toggleMinimize}
							className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
							aria-label="Expand player to seek"
							title="Expand to seek in video"
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
									d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
								/>
							</svg>
						</button>

						{/* Close */}
						<button
							onClick={stop}
							className="text-gray-400 hover:text-red-400 p-2 rounded-full hover:bg-white/10 transition-all"
							aria-label="Close player"
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
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default MiniPlayer;

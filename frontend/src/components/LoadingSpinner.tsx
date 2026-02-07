const LoadingSpinner = () => {
	return (
		<div className="flex h-screen items-center justify-center bg-[#121212]">
			<div className="w-12 h-12 border-4 border-white/10 border-t-[#1db954] rounded-full animate-spin"></div>
		</div>
	);
};

export default LoadingSpinner;

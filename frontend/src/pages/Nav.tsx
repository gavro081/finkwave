import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance, { baseURL } from "../api/axiosInstance";
import Logo from "../assets/logo-finkwave.png";
import { useAuth } from "../context/authContext";

interface NavProps {
	isSidebarOpen?: boolean;
	onToggleSidebar?: () => void;
}

const Nav = ({ isSidebarOpen = false, onToggleSidebar }: NavProps) => {
	const { user, setUser, isAuthLoading } = useAuth();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			await axiosInstance.post("/auth/logout");
			setUser(undefined);
			setIsDropdownOpen(false);
			window.location.href = "/";
			// toast.success("Logout successful!");
		} catch (error) {
			console.error("Logout failed:", error);
			toast.error("Logout failed!");
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div
			className={`bg-gray-800 p-4 flex justify-between items-center fixed top-0 right-0 z-50 transition-all duration-300 ${
				isSidebarOpen ? "left-64" : "left-0"
			}`}
		>
			<div className="flex items-center gap-4">
				{onToggleSidebar && user && (
					<button
						onClick={onToggleSidebar}
						className="text-white hover:text-[#1db954] transition-colors p-2 cursor-pointer"
						aria-label="Toggle sidebar"
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
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				)}
				<Link to="/" className="text-white text-lg font-semibold">
					<img src={Logo} alt="Finkwave Logo" className="h-12 w-auto" />
				</Link>
			</div>

			<div className="flex items-center space-x-4">
				{!isAuthLoading && (
					<div className="flex items-center space-x-3">
						{user?.isArtist && (
							<Link
								to="/my-songs"
								className="text-white hover:text-[#1db954] px-4 py-2 text-sm font-medium transition-colors"
							>
								My Songs
							</Link>
						)}
						{user ? (
							<div className="relative" ref={dropdownRef}>
								<button
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
								>
									{user.profilePhoto ? (
										<img
											src={`${baseURL}/${user.profilePhoto}`}
											alt={`${user.username}'s profile`}
											className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
										/>
									) : (
										<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all">
											<span className="text-white text-lg font-semibold">
												{user.username.charAt(0).toUpperCase()}
											</span>
										</div>
									)}
								</button>

								{isDropdownOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-1 z-50">
										<Link
											to="/me"
											className="block px-4 py-2 text-sm text-white hover:bg-gray-600 transition-colors"
											onClick={() => setIsDropdownOpen(false)}
										>
											Account
										</Link>
										<button
											onClick={handleLogout}
											className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 transition-colors"
										>
											Log out
										</button>
									</div>
								)}
							</div>
						) : (
							<div className="flex items-center space-x-4">
								<Link
									to="/login"
									className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm 
                                    font-medium transition-colors duration-200 cursor-pointer"
								>
									Login
								</Link>
								<Link
									to="/register"
									className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm
                                    font-medium transition-colors duration-200 cursor-pointer"
								>
									Register
								</Link>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Nav;

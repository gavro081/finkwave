import { Link } from "react-router-dom";
import axiosInstance from "./api/axiosInstance";
import { useAuth } from "./context/authContext";

const Nav = () => {
	const { user, setUser, isAuthLoading } = useAuth();

	const handleLogout = async () => {
		try {
			await axiosInstance.post("/auth/logout");
			setUser(undefined);
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<div className="bg-gray-800 p-4 flex justify-between items-center">
			<Link to="/" className="text-white text-lg font-semibold">
				Finkwave
			</Link>

			<div className="flex items-center space-x-4">
				{!isAuthLoading && (
					<div className="flex items-center space-x-3">
						{user ? (
							<div className="flex items-center space-x-3">
								<div className="flex items-center space-x-2 bg-slate-700 rounded-lg px-3 py-2">
									<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
										<span className="text-white text-sm font-semibold">
											{user.username.charAt(0).toUpperCase()}
										</span>
									</div>
									<div className="text-white">
										<p className="text-sm font-medium">{user.username}</p>
										<p className="text-xs text-gray-300 capitalize">
											{user.role}
										</p>
									</div>
								</div>
								<button
									onClick={(e) => {
										e.preventDefault();
										handleLogout();
									}}
									className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
								>
									Logout
								</button>
							</div>
						) : (
							<div className="flex items-center space-x-2">
								<Link
									to="/login"
									className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
								>
									Login
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

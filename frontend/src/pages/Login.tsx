import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance, { scheduleTokenRefresh } from "../api/axiosInstance";
import { useAuth } from "../context/authContext";
import type { User } from "../utils/types";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const { setUser } = useAuth();
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axiosInstance.post<{
				user: User;
				tokenExpiresIn: number;
			}>("/auth/login", { username, password });
			scheduleTokenRefresh(response.data.tokenExpiresIn);
			setUser(response.data.user);
			navigate("/");
			toast.success("Login successful!");
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.error ||
				"Login failed. Please check your credentials.";
			setError(`Login failed: ${errorMessage}`);
		}
	};
	return (
		<div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-extrabold text-white mb-2">
						Welcome Back
					</h1>
					<p className="text-gray-400">Log in to continue to FinkWave</p>
				</div>

				<form
					onSubmit={handleLogin}
					className="bg-[#181818] rounded-xl p-8 space-y-6"
				>
					{error && (
						<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
							<p className="text-red-400 text-sm">{error}</p>
						</div>
					)}

					<div>
						<label
							className="block text-sm font-medium text-gray-300 mb-2"
							htmlFor="username"
						>
							Username
						</label>
						<input
							type="text"
							id="username"
							className="w-full bg-[#282828] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
							placeholder="Enter your username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium text-gray-300 mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							className="w-full bg-[#282828] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<button
						type="submit"
						className="w-full py-3 bg-[#1db954] rounded-full text-black font-semibold hover:bg-[#1ed760] transition-colors cursor-pointer"
					>
						Log In
					</button>

					<p className="text-center text-sm text-gray-400">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="text-[#1db954] hover:underline font-medium"
						>
							Sign up
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Login;

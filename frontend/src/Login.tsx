import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { scheduleTokenRefresh } from "./api/axiosInstance";
import { useAuth } from "./context/authContext";
import type { User } from "./types";

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
		} catch (error) {
			setError("Login failed. Please check your credentials.");
		}
	};
	return (
		<div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100">
			<h2 className="text-2xl mb-4">Login</h2>
			<form
				onSubmit={handleLogin}
				className="bg-white p-6 rounded shadow-md w-80"
			>
				{error && <p className="text-red-500 mb-4">{error}</p>}
				<div className="mb-4">
					<label className="block text-gray-700 mb-2" htmlFor="username">
						Username
					</label>
					<input
						type="text"
						id="username"
						className="w-full p-2 border border-gray-300 rounded"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 mb-2" htmlFor="password">
						Password
					</label>
					<input
						type="password"
						id="password"
						className="w-full p-2 border border-gray-300 rounded"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button
					type="submit"
					className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 w-full cursor-pointer"
				>
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;

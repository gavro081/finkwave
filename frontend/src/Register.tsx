import { useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance, { scheduleTokenRefresh } from "./api/axiosInstance";
import { useAuth } from "./context/authContext";
import type { User } from "./types";

const Register = () => {
	const { setUser } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [fullname, setFullname] = useState("");
	const [email, setEmail] = useState("");
	const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

	const navigate = useNavigate();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axiosInstance.post<{
				user: User;
				tokenExpiresIn: number;
			}>("/auth/register", {
				username,
				fullname,
				email,
				password,
				profilePhoto,
			});
			scheduleTokenRefresh(response.data.tokenExpiresIn);
			setUser(response.data.user);
			navigate("/");
		} catch (error) {
			console.error("Registration failed:", error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100">
			<h2 className="text-2xl mb-4">Register</h2>
			<form className="bg-white p-6 rounded shadow-md w-80">
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
				<div className="mb-4">
					<label className="block text-gray-700 mb-2" htmlFor="fullName">
						Full Name
					</label>
					<input
						type="text"
						id="fullName"
						className="w-full p-2 border border-gray-300 rounded"
						value={fullname}
						onChange={(e) => setFullname(e.target.value)}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 mb-2" htmlFor="email">
						Email
					</label>
					<input
						type="email"
						id="email"
						className="w-full p-2 border border-gray-300 rounded"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 mb-2" htmlFor="profilePhoto">
						Profile Photo URL
					</label>
					<input
						placeholder="todo"
						type="text"
						id="profilePhoto"
						className="w-full p-2 border border-gray-300 rounded"
						value={profilePhoto || ""}
						onChange={(e) => setProfilePhoto(e.target.value)}
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
					onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
						handleRegister(e)
					}
				>
					Register
				</button>
			</form>
		</div>
	);
};

export default Register;

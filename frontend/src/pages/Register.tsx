import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axiosInstance, { scheduleTokenRefresh } from "../api/axiosInstance";
import { useAuth } from "../context/authContext";
import type { User } from "../utils/types";

const Register = () => {
	const { setUser } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [fullname, setFullname] = useState("");
	const [email, setEmail] = useState("");
	const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
	const [previewProfilePhoto, setPreviewProfilePhoto] = useState<string | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	useEffect(() => {
		return () => {
			if (previewProfilePhoto) {
				URL.revokeObjectURL(previewProfilePhoto);
			}
		};
	}, [previewProfilePhoto]);

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		if (profilePhotoFile && profilePhotoFile.size > 5 * 1024 * 1024) {
			alert("Max file size is 5MB");
			return;
		}

		if (profilePhotoFile && !profilePhotoFile.type.startsWith("image/")) {
			alert("Only images allowed");
			return;
		}
		const formData = new FormData();
		if (profilePhotoFile) formData.append("profilePhoto", profilePhotoFile);
		formData.append("username", username);
		formData.append("fullname", fullname);
		formData.append("email", email);
		formData.append("password", password);

		try {
			const response = await axiosInstance.post<{
				user: User;
				tokenExpiresIn: number;
			}>("/auth/register", formData);
			scheduleTokenRefresh(response.data.tokenExpiresIn);
			setUser(response.data.user);
			navigate("/");
			toast.success("Registration successful!");
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.error || "Registration failed. Please try again.";
			setError(`Registration failed: ${errorMessage}`);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100">
			<h2 className="text-2xl mb-4">Register</h2>
			<form className="bg-white p-6 rounded shadow-md w-80">
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
					<label className="block text-gray-700 mb-2">Profile Photo</label>
					<div className="flex items-center gap-3">
						<label
							htmlFor="profilePhoto"
							className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors text-sm font-medium"
						>
							Choose File
						</label>
						<span className="text-gray-600 text-sm">
							{profilePhotoFile ? profilePhotoFile.name : "No file chosen"}
						</span>
					</div>
					<input
						type="file"
						accept="image/*"
						id="profilePhoto"
						className="hidden"
						onChange={(e) => {
							if (e.target.files && e.target.files[0]) {
								setProfilePhotoFile(e.target.files[0]);
								setPreviewProfilePhoto(URL.createObjectURL(e.target.files[0]));
							}
						}}
					/>
				</div>
				{previewProfilePhoto && (
					<div className="mb-4">
						<p className="block text-gray-700 mb-2">Profile Photo Preview:</p>
						<img
							src={previewProfilePhoto}
							alt="Profile Preview"
							className="w-20 h-20 object-cover rounded-full"
						/>
					</div>
				)}
				<button
					type="submit"
					className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
					onClick={handleRegister}
				>
					Register
				</button>
			</form>
		</div>
	);
};

export default Register;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance, { scheduleTokenRefresh } from "../api/axiosInstance";
import { useAuth } from "../context/authContext";
import type { User, UserRegisterType } from "../utils/types";

const Register = () => {
	const { setUser } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [fullname, setFullname] = useState("");
	const [userType, setUserType] = useState<UserRegisterType[]>([]);
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

	const handleRemoveFile = () => {
		if (previewProfilePhoto) {
			URL.revokeObjectURL(previewProfilePhoto);
		}
		setProfilePhotoFile(null);
		setPreviewProfilePhoto(null);
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		if (profilePhotoFile && profilePhotoFile.size > 5 * 1024 * 1024) {
			toast.error("Max file size is 5MB");
			return;
		}

		if (
			username === "" ||
			password === "" ||
			fullname === "" ||
			email === "" ||
			userType.length === 0
		) {
			setError("Please fill in all required fields.");
			return;
		}
		if (profilePhotoFile && !profilePhotoFile.type.startsWith("image/")) {
			toast.error("Only images allowed");
			return;
		}
		const formData = new FormData();
		if (profilePhotoFile) formData.append("profilePhoto", profilePhotoFile);
		formData.append("username", username);
		formData.append("fullname", fullname);
		formData.append("email", email);
		formData.append("password", password);
		userType.forEach((type) => formData.append("userType", type));

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
			const errorMessage = error.response?.data?.error || "Please try again.";
			setError(`Registration failed: ${errorMessage}`);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] flex items-center justify-center px-4 py-10">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-extrabold text-white mb-2">
						Create Account
					</h1>
					<p className="text-gray-400">Join FinkWave and discover music</p>
				</div>

				<form
					className="bg-[#181818] rounded-xl p-8 space-y-6"
					onSubmit={handleRegister}
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
							Username *
						</label>
						<input
							type="text"
							id="username"
							className="w-full bg-[#282828] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
							placeholder="Choose a username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium text-gray-300 mb-2"
							htmlFor="password"
						>
							Password *
						</label>
						<input
							type="password"
							id="password"
							className="w-full bg-[#282828] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
							placeholder="Create a password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium text-gray-300 mb-2"
							htmlFor="fullName"
						>
							Full Name *
						</label>
						<input
							type="text"
							id="fullName"
							className="w-full bg-[#282828] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
							placeholder="Enter your full name"
							value={fullname}
							onChange={(e) => setFullname(e.target.value)}
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium text-gray-300 mb-2"
							htmlFor="email"
						>
							Email *
						</label>
						<input
							type="email"
							id="email"
							className="w-full bg-[#282828] border border-white/10 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-300 mb-3">
							I want to be a... *
						</label>
						<div className="flex gap-3">
							<label
								className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
									userType.includes("ARTIST")
										? "border-[#1db954] bg-[#1db954]/10"
										: "border-white/10 hover:border-white/20"
								}`}
							>
								<input
									type="checkbox"
									value="ARTIST"
									checked={userType.includes("ARTIST")}
									onChange={(e) => {
										if (e.target.checked) {
											setUserType((prev) => [...prev, "ARTIST"]);
										} else {
											setUserType((prev) =>
												prev.filter((type) => type !== "ARTIST"),
											);
										}
									}}
									className="hidden"
								/>
								<svg
									className={`w-5 h-5 ${userType.includes("ARTIST") ? "text-[#1db954]" : "text-gray-400"}`}
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
								<span
									className={`text-sm font-medium ${userType.includes("ARTIST") ? "text-white" : "text-gray-400"}`}
								>
									Artist
								</span>
							</label>

							<label
								className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
									userType.includes("LISTENER")
										? "border-[#1db954] bg-[#1db954]/10"
										: "border-white/10 hover:border-white/20"
								}`}
							>
								<input
									type="checkbox"
									value="LISTENER"
									checked={userType.includes("LISTENER")}
									onChange={(e) => {
										if (e.target.checked) {
											setUserType((prev) => [...prev, "LISTENER"]);
										} else {
											setUserType((prev) =>
												prev.filter((type) => type !== "LISTENER"),
											);
										}
									}}
									className="hidden"
								/>
								<svg
									className={`w-5 h-5 ${userType.includes("LISTENER") ? "text-[#1db954]" : "text-gray-400"}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M15.536 8.464a5 5 0 010 7.072M12 12h.01M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728"
									/>
								</svg>
								<span
									className={`text-sm font-medium ${userType.includes("LISTENER") ? "text-white" : "text-gray-400"}`}
								>
									Listener
								</span>
							</label>
						</div>
					</div>

					{/* Profile Photo - PublishSong style */}
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Profile Photo (optional)
						</label>
						<div className="flex items-center justify-start gap-4">
							{previewProfilePhoto ? (
								<div className="relative">
									<img
										src={previewProfilePhoto}
										alt="Profile Preview"
										className="w-24 h-24 rounded-full object-cover"
									/>
									<button
										type="button"
										onClick={handleRemoveFile}
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
									htmlFor="profilePhoto"
									className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#1db954] transition-colors"
								>
									<svg
										className="w-8 h-8 text-gray-400 mb-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									<span className="text-xs text-gray-400">Upload</span>
								</label>
							)}
							<input
								type="file"
								accept="image/*"
								id="profilePhoto"
								className="hidden"
								onChange={(e) => {
									if (e.target.files && e.target.files[0]) {
										setProfilePhotoFile(e.target.files[0]);
										setPreviewProfilePhoto(
											URL.createObjectURL(e.target.files[0]),
										);
									}
								}}
							/>
							<div className="text-sm text-gray-400 pt-2">
								<p>Max size: 2MB</p>
								<p>JPG, PNG, or WebP</p>
							</div>
						</div>
					</div>

					<button
						type="submit"
						className="w-full py-3 bg-[#1db954] rounded-full text-black font-semibold hover:bg-[#1ed760] transition-colors cursor-pointer"
					>
						Create Account
					</button>

					<p className="text-center text-sm text-gray-400">
						Already have an account?{" "}
						<Link
							to="/login"
							className="text-[#1db954] hover:underline font-medium"
						>
							Log in
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default Register;

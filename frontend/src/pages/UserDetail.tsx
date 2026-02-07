import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import ArtistView from "../components/userProfile/ArtistView";
import ListenerView from "../components/userProfile/ListenerView";
import UserListModal from "../components/userProfile/UserListModal";
import { useAuth } from "../context/authContext";
import { handleError } from "../utils/error";
import type {
	ArtistContribution,
	BaseNonAdminUser,
	MusicalEntity,
	Playlist,
} from "../utils/types";

interface FollowStatus {
	isFollowing: boolean;
	followerCount: number;
	followingCount: number;
}

interface Artist extends BaseNonAdminUser {
	userType: "ARTIST";
	contributions: ArtistContribution[];
}
interface Listener extends BaseNonAdminUser {
	userType: "LISTENER";
	likedEntities: MusicalEntity[];
	createdPlaylists: Playlist[];
	savedPlaylists: Playlist[];
}

type UserProfile = Artist | Listener;

const UserDetail = () => {
	// user refers to the selected user NOT to the user from context
	const baseURL = import.meta.env.VITE_API_BASE_URL;
	const { username: usernameParam } = useParams();
	// sintaksava dole znaci zemi go user od auth context i preimenuvaj go vo currentUser, za da ne se izmesa so user-ot dole
	const { user: currentUser } = useAuth();
	const navigate = useNavigate();
	const [user, setUser] = useState<UserProfile | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [modalUsers, setModalUsers] = useState<any[]>([]);
	const [isLoadingModal, setIsLoadingModal] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);

	// determine which username to use: URL param or current user's username
	const username = usernameParam || currentUser?.username;

	// if we're on /me route and no user is logged in, show error
	if (!usernameParam && !currentUser) {
		return (
			<div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
				<h2 className="font-bold">Authentication Required</h2>
				<p>You must be logged in to view your profile.</p>
				<button
					onClick={() => navigate("/login")}
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
				>
					Go to Login
				</button>
			</div>
		);
	}

	const handleFollow = async () => {
		if (!user) return;

		setIsFollowing(true);
		try {
			const response = await axiosInstance.post<FollowStatus>(
				`/users/na/${username}/follow`,
			);
			setUser((prev) => {
				if (!prev) return null;
				return {
					...prev,
					isFollowedByCurrentUser: response.data.isFollowing,
					followers: response.data.followerCount,
					following: response.data.followingCount,
				};
			});
		} catch (err: any) {
			setError(handleError(err));
		} finally {
			setIsFollowing(false);
		}
	};

	const handleFollowInModal = async (targetUsername: string) => {
		try {
			const response = await axiosInstance.post<FollowStatus>(
				`/users/na/${username}/follow`,
			);

			setModalUsers((prevUsers) =>
				prevUsers.map((u) =>
					u.username === targetUsername
						? { ...u, isFollowedByCurrentUser: response.data.isFollowing }
						: u,
				),
			);

			// if (user && user.id === targetId) {
			//   setUser((prev) => {
			//     if (!prev) return null;
			//     return {
			//       ...prev,
			//       isFollowedByCurrentUser: response.data.isFollowing,
			//       followers: response.data.followerCount,
			//     };
			//   });
			// }
		} catch (err: any) {
			setError(handleError(err));
		}
	};

	const displayFollowers = async () => {
		setIsLoadingModal(true);
		try {
			const response = await axiosInstance.get(
				`/users/na/${username}/followers`,
			);
			setModalUsers(response.data);
			setModalTitle("Followers");
			setShowModal(true);
		} catch (err) {
			setError(handleError(err));
		} finally {
			setIsLoadingModal(false);
		}
	};
	const displayFollowing = async () => {
		setIsLoadingModal(true);
		try {
			const response = await axiosInstance.get(
				`/users/na/${username}/following`,
			);
			setModalUsers(response.data);
			setModalTitle("Following");
			setShowModal(true);
		} catch (err: any) {
			setError(handleError(err));
		} finally {
			setIsLoadingModal(false);
		}
	};

	useEffect(() => {
		const fetchUser = async () => {
			setError(null);
			try {
				const response = await axiosInstance.get(`/users/na/${username}`);
				console.log(response.data);
				setUser(response.data);
			} catch (err: any) {
				setError(handleError(err));
			}
		};
		fetchUser();
	}, [username]);

	if (error) {
		return (
			<div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
				<h2 className="font-bold">Error</h2>
				<p>{error}</p>
			</div>
		);
	}

	if (!user) {
		return <LoadingSpinner />;
	}

	return (
		<div className="container mx-auto p-6">
			{isLoadingModal && (
				<div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center">
					<div className="flex items-center gap-3">
						<div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
					</div>
				</div>
			)}
			<button
				onClick={() => navigate(-1)}
				className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
			>
				← Back
			</button>

			<div className="bg-white shadow-lg rounded-lg p-8">
				<div className="flex items-start gap-6 mb-8">
					<div className="shrink-0">
						<div className="w-32 h-32 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
							{user.profilePhoto ? (
								<img
									src={`${baseURL}/${user.profilePhoto}`}
									alt={user.fullName}
									className="w-full h-full object-cover"
								/>
							) : (
								user.fullName.charAt(0).toUpperCase()
							)}
						</div>
					</div>

					<div className="flex-1">
						<h1 className="text-4xl font-bold mb-2">{user.fullName}</h1>
						<span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
							{user.userType}
						</span>

						<div className="flex gap-6 mb-4 text-gray-700">
							<div
								className={`flex flex-col ${user.userType == "LISTENER" ? "cursor-pointer" : "cursor-default"}`}
								onClick={
									user.userType === "LISTENER" ? displayFollowers : undefined
								}
							>
								<span className="text-2xl font-bold">{user.followers}</span>
								<span className="text-sm text-gray-500">Followers</span>
							</div>
							<div
								className={`flex flex-col ${user.userType == "LISTENER" ? "cursor-pointer" : "cursor-default"}`}
								onClick={
									user.userType === "LISTENER" ? displayFollowing : undefined
								}
							>
								<span className="text-2xl font-bold">{user.following}</span>
								<span className="text-sm text-gray-500">Following</span>
							</div>
						</div>

						<button
							onClick={handleFollow}
							disabled={isFollowing}
							className={`
                px-6 py-2 font-semibold rounded-lg shadow-md 
                transition-colors duration-200
                ${
									isFollowing
										? "bg-gray-400 text-gray-200 cursor-not-allowed"
										: user.isFollowedByCurrentUser
											? "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
											: "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
								}
              `}
						>
							{user.isFollowedByCurrentUser ? "Unfollow" : "Follow"}
						</button>
					</div>
				</div>

				{user.userType === "ARTIST" ? (
					<ArtistView contributions={user.contributions} />
				) : (
					<ListenerView
						likedEntities={user.likedEntities}
						createdPlaylists={user.createdPlaylists}
						savedPlaylists={user.savedPlaylists}
					/>
				)}

				{showModal && (
					<UserListModal
						title={modalTitle}
						users={modalUsers}
						onClose={() => setShowModal(false)}
						onFollowToggle={handleFollowInModal}
					/>
				)}
			</div>
		</div>
	);
};

export default UserDetail;

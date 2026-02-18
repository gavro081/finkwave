import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance, { baseURL } from "../api/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import ArtistView from "../components/userProfile/ArtistView";
import ListenerView from "../components/userProfile/ListenerView";
import UserListModal from "../components/userProfile/UserListModal";
import { useAuth } from "../context/authContext";
import { getErrorMessage } from "../utils/error";
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
  const { username: usernameParam } = useParams();
  const { user: currentUser } = useAuth();

  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalUsers, setModalUsers] = useState<any[]>([]);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const username = usernameParam || currentUser?.username;
  const isOwnProfile = currentUser?.username === username;

  if (!usernameParam && !currentUser) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">
            You must be logged in to view your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="text-[#1db954] hover:underline text-sm cursor-pointer"
          >
            Go to Login
          </button>
        </div>
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
      setError(getErrorMessage(err));
    } finally {
      setIsFollowing(false);
    }
  };

  const handleFollowInModal = async (targetUsername: string) => {
    try {
      const response = await axiosInstance.post<FollowStatus>(
        `/users/na/${targetUsername}/follow`,
      );

      setModalUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.username === targetUsername
            ? { ...u, isFollowedByCurrentUser: response.data.isFollowing }
            : u,
        ),
      );
    } catch (err: any) {
      setError(getErrorMessage(err));
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
      setError(getErrorMessage(err));
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
      setError(getErrorMessage(err));
    } finally {
      setIsLoadingModal(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setError(null);
      setUser(null);
      try {
        const response = await axiosInstance.get(`/users/na/${username}`);

        setUser(response.data);
      } catch (err: any) {
        setError(getErrorMessage(err));
      }
    };
    fetchUser();
  }, [username]);

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <Link to="/" className="text-[#1db954] hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] text-white">
      {isLoadingModal && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-white/10 border-t-[#1db954] rounded-full animate-spin" />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        {/* Hero section */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Profile photo */}
          <div className="w-full md:w-48 shrink-0">
            <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl bg-[#181818] mx-auto md:mx-0">
              {user.profilePhoto ? (
                <img
                  src={`${baseURL}/${user.profilePhoto}`}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-[#1db954] to-[#1ed760] flex items-center justify-center text-white text-5xl font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* User info */}
          <div className="flex flex-col justify-end gap-3 min-w-0">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              {user.userType === "ARTIST" ? "Artist" : "Listener"} • Profile
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              {user.fullName}
            </h1>
            <p className="text-gray-400">@{user.username}</p>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-2">
              <div
                className={`${user.userType === "LISTENER" ? "cursor-pointer hover:text-white" : ""} transition-colors`}
                onClick={
                  user.userType === "LISTENER" ? displayFollowers : undefined
                }
              >
                <span className="text-xl font-bold text-white">
                  {user.followers}
                </span>
                <span className="text-sm text-gray-400 ml-1">Followers</span>
              </div>
              <div
                className={`${user.userType === "LISTENER" ? "cursor-pointer hover:text-white" : ""} transition-colors`}
                onClick={
                  user.userType === "LISTENER" ? displayFollowing : undefined
                }
              >
                <span className="text-xl font-bold text-white">
                  {user.following}
                </span>
                <span className="text-sm text-gray-400 ml-1">Following</span>
              </div>
            </div>

            {/* Follow button - hidden on own profile */}
            {currentUser && !isOwnProfile && (
              <div className="mt-4">
                <button
                  onClick={handleFollow}
                  disabled={isFollowing}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                    isFollowing
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : user.isFollowedByCurrentUser
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : "bg-[#1db954] text-black hover:bg-[#1ed760] hover:scale-105"
                  }`}
                >
                  {user.isFollowedByCurrentUser ? (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Following
                    </>
                  ) : (
                    <>
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Follow
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
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

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ArtistView from "../components/userProfile/ArtistView";
import ListenerView from "../components/userProfile/ListenerView";
import type {
  MusicalEntity,
  Playlist,
  ArtistContribution,
} from "../utils/types";

interface BaseUser {
  id: number;
  fullName: string;
  userType: string;
  followers: number;
  following: number;
  isFollowedByCurrentUser: boolean;
}

interface Artist extends BaseUser {
  userType: "ARTIST";
  contributions: ArtistContribution[];
}
interface Listener extends BaseUser {
  userType: "LISTENER";
  likedEntities: MusicalEntity[];
  createdPlaylists: Playlist[];
}

type UserProfile = Artist | Listener;

const UserDetail = () => {
  // user refers to the selected user NOT to the user from context
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    if (!user) return;

    setIsFollowing(true);
    try {
      const response = await axiosInstance.post<UserProfile>(
        `/users/follow/${userId}`,
      );
    } catch (err: any) {
      console.error(err.response?.data?.error);
    } finally {
      setIsFollowing(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setError(null);
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        console.log(response.data);

        setUser(response.data);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || "Failed to fetch user";
        setError(errorMessage);
      }
    };
    fetchUser();
  }, [userId]);

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        <h2 className="font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        ← Back
      </button>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-start gap-6 mb-8">
          <div className="shrink-0">
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{user.fullName}</h1>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              {user.userType}
            </span>

            <div className="flex gap-6 mb-4 text-gray-700">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{user.followers}</span>
                <span className="text-sm text-gray-500">Followers</span>
              </div>
              <div className="flex flex-col">
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
            playlists={user.createdPlaylists}
          />
        )}
      </div>
    </div>
  );
};

export default UserDetail;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  fullName: string;
  followerCount: number;
  followingCount: number;
  userType: string;
  contributions?: {
    role: string;
    title: string;
    musicalEntityId: number;
    entityType: string;
  }[];

  likedEntities?: {
    entityId: number;
    entityTitle: string;
    entityGenre: string;
    entityType: string;
  }[];
}

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      console.log(userId);
      const response = await fetch(`http://localhost:8080/users/${userId}`);
      const data = await response.json();
      setUser(data);
    };
    fetchUser();
  }, [userId]);

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      {/* <button
        onClick={() => navigate("/allUsers")}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ← Back to All Users
      </button> */}
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4">{user.fullName}</h1>
        <p className="text-gray-600 text-lg mb-2">Username: @{user.username}</p>
        <p className="text-gray-600 text-lg mb-2">
          Followers: {user.followerCount}
        </p>
        <p className="text-gray-600 text-lg mb-2">
          Following: {user.followingCount}
        </p>
        <p>Type: {user.userType}</p>
        {user.userType === "Artist" && user.contributions && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-bold mb-4">Discography</h2>
            <div className="grid gap-3">
              {user.contributions.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.entityType}</p>
                  </div>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                    {item.role}
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                    {item.musicalEntityId}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {user.userType === "Listener" && user.likedEntities && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Liked Songs & Albums</h3>
            <div className="grid gap-2">
              {user.likedEntities.map((like) => (
                <div
                  key={like.entityId}
                  className="p-3 bg-gray-50 rounded flex justify-between"
                >
                  <span>{like.entityTitle}</span>
                  <span className="text-sm text-gray-400">
                    {like.entityType}
                  </span>
                  <span className="text-sm text-gray-400">
                    {like.entityGenre}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;

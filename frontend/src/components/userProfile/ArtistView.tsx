import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Music, Disc3, Play, Plus } from "lucide-react";
import type { ArtistContribution } from "../../utils/types";
import axiosInstance from "../../api/axiosInstance";

interface ArtistViewProps {
  contributions: ArtistContribution[];
}

const ArtistView = ({ contributions }: ArtistViewProps) => {
  const navigate = useNavigate();
  const [items, setItems] = useState(contributions);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({
    message: "",
    show: false,
  });

  const albums = items.filter((c) => c.entityType === "ALBUM");
  const songs = items.filter((c) => c.entityType === "SONG");

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      COMPOSER: "bg-purple-100 text-purple-700",
      PERFORMER: "bg-blue-100 text-blue-700",
      PRODUCER: "bg-green-100 text-green-700",
      MAIN_VOCAL: "bg-pink-100 text-pink-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast({ message: "", show: false });
    }, 2000);
  };

  const handleLike = async (id: number, title: string) => {
    try {
      const response = await axiosInstance.post(`/musical-entity/${id}/like`);
      const data = response.data;

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === data.entityId
            ? { ...item, isLikedByCurrentUser: data.isLiked }
            : item,
        ),
      );

      showToast(
        data.isLiked ? `Liked "${title}"` : `Removed ${title} from likes`,
      );
    } catch (err: any) {
      showToast(err.response?.data?.error);
    }
  };

  return (
    <div className="mt-8">
      {toast.show && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium">
            {toast.message}
          </div>
        </div>
      )}

      {albums.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Disc3 className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-800">Albums</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/collection/album/${album.id}`)}
              >
                <div className="relative aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-3 overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Disc3 className="w-16 h-16 text-white opacity-30" />
                  </div>

                  <button
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                    title={album.isLikedByCurrentUser ? "Unlike" : "Like"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(album.id, album.title);
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={album.isLikedByCurrentUser ? "#ef4444" : "none"}
                      stroke={
                        album.isLikedByCurrentUser ? "#ef4444" : "#6b7280"
                      }
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(album.role)}`}
                    >
                      {album.role.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {album.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {songs.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Music className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-800">Songs</h2>
          </div>
          <div className="space-y-2">
            {songs.map((song) => (
              <div
                key={song.id}
                className="group relative flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                onClick={() => navigate(`/musical-entity/${song.id}`)}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center shadow-sm">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <button
                    className="absolute inset-0 bg-black/60 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label="Play song"
                  >
                    <Play className="w-6 h-6 text-white fill-white" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {song.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">{song.genre}</span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(song.role)}`}
                >
                  {song.role.replace("_", " ")}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 cursor-pointer"
                    title="Add to playlist"
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>

                  <button
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 cursor-pointer"
                    title={song.isLikedByCurrentUser ? "Unlike" : "Like"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(song.id, song.title);
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={song.isLikedByCurrentUser ? "#ef4444" : "none"}
                      stroke={song.isLikedByCurrentUser ? "#ef4444" : "#6b7280"}
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {contributions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Music className="w-20 h-20 mb-4 opacity-20" />
          <p className="text-lg font-medium">No contributions yet</p>
          <p className="text-sm mt-2">Start creating music to see it here</p>
        </div>
      )}
    </div>
  );
};

export default ArtistView;

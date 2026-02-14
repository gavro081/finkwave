import { Disc3, Music } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance, { baseURL } from "../../api/axiosInstance";
import type { ArtistContribution } from "../../utils/types";
import SongItem from "../SongItem";

interface ArtistViewProps {
  contributions: ArtistContribution[];
}

const ArtistView = ({ contributions }: ArtistViewProps) => {
  const navigate = useNavigate();
  const [items, setItems] = useState(contributions);
  const [openDropdownSongId, setOpenDropdownSongId] = useState<number | null>(
    null,
  );

  const albums = items.filter((c) => c.entityType === "ALBUM");
  const songs = items.filter((c) => c.entityType === "SONG");

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      COMPOSER: "bg-purple-500/20 text-purple-300",
      PERFORMER: "bg-blue-500/20 text-blue-300",
      PRODUCER: "bg-green-500/20 text-green-300",
      MAIN_VOCAL: "bg-pink-500/20 text-pink-300",
    };
    return colors[role] || "bg-white/10 text-gray-300";
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
      toast.success(
        data.isLiked ? `Liked "${title}"` : `Removed "${title}" from likes`,
      );
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to like the item");
    }
  };

  return (
    <div className="mt-8">
      {albums.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Disc3 className="w-6 h-6 text-[#1db954]" />
            <h2 className="text-2xl font-bold text-white">Albums</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/collection/album/${album.id}`)}
              >
                <div className="relative aspect-square rounded-lg mb-3 overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 bg-[#181818]">
                  <img
                    src={
                      album.cover ? `${baseURL}/${album.cover}` : "/favicon.png"
                    }
                    alt={album.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/favicon.png";
                    }}
                  />

                  <button
                    className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black/90 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
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
                        album.isLikedByCurrentUser ? "#ef4444" : "#9ca3af"
                      }
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(album.role)}`}
                    >
                      {album.role.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 text-white group-hover:text-[#1db954] transition-colors">
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
            <Music className="w-6 h-6 text-[#1db954]" />
            <h2 className="text-2xl font-bold text-white">Songs</h2>
          </div>
          <div className="space-y-1">
            {songs.map((song) => (
              <SongItem
                key={song.id}
                song={{
                  id: song.id,
                  title: song.title,
                  cover: song.cover,
                  genre: song.genre,
                  link: song.link,
                  isLikedByCurrentUser: song.isLikedByCurrentUser,
                }}
                role={song.role}
                onLikeToggle={() => handleLike(song.id, song.title)}
                isDropdownOpen={openDropdownSongId === song.id}
                onDropdownToggle={setOpenDropdownSongId}
              />
            ))}
          </div>
        </div>
      )}

      {contributions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Music className="w-20 h-20 mb-4 opacity-20" />
          <p className="text-lg font-medium">No contributions yet</p>
          <p className="text-sm mt-2">Start creating music to see it here</p>
        </div>
      )}
    </div>
  );
};

export default ArtistView;

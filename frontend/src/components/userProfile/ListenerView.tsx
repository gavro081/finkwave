import { Album, Bookmark, Heart, ListMusic, Music } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance, { baseURL } from "../../api/axiosInstance";
import type { MusicalEntity, Playlist } from "../../utils/types";
import SongItem from "../SongItem";
import { useAuth } from "../../context/authContext";

interface ListenerViewProps {
  likedEntities: MusicalEntity[] | [];
  createdPlaylists: Playlist[] | [];
  savedPlaylists: Playlist[] | [];
}

const ListenerView = ({
  likedEntities,
  createdPlaylists,
  savedPlaylists,
}: ListenerViewProps) => {
  const navigate = useNavigate();
  const { username: usernameParam } = useParams();
  const { user: currentUser } = useAuth();
  const [items, setItems] = useState(likedEntities);
  const [createdItems, setCreatedItems] = useState(createdPlaylists);
  const [savedItems, setSavedItems] = useState(savedPlaylists);
  const [openDropdownSongId, setOpenDropdownSongId] = useState<number | null>(
    null,
  );

  const likedSongs = items.filter((e) => e.type === "SONG");
  const likedAlbums = items.filter((e) => e.type === "ALBUM");
  const username = usernameParam || currentUser?.username;
  const isOwnProfile = currentUser?.username === username;

  const handleSavePlaylist = async (
    e: React.MouseEvent,
    playlistId: number,
    playlistName: string,
  ) => {
    e.stopPropagation();

    try {
      const response = await axiosInstance.post(
        `/playlists/${playlistId}/save`,
      );
      const data = response.data;

      setCreatedItems((prevItems) =>
        prevItems.map((p) =>
          p.id === playlistId
            ? { ...p, isSavedByCurrentUser: data.isSavedByCurrentUser }
            : p,
        ),
      );

      setSavedItems((prevItems) =>
        prevItems.map((p) =>
          p.id === playlistId
            ? { ...p, isSavedByCurrentUser: data.isSavedByCurrentUser }
            : p,
        ),
      );

      if (isOwnProfile) {
        if (data.isSavedByCurrentUser) {
          const playlistToAdd = createdItems.find((p) => p.id === playlistId);
          if (playlistToAdd && !savedItems.find((p) => p.id === playlistId)) {
            setSavedItems((prevItems) => [
              ...prevItems,
              { ...playlistToAdd, isSavedByCurrentUser: true },
            ]);
          }
        } else {
          setSavedItems((prevItems) =>
            prevItems.filter((p) => p.id !== playlistId),
          );
        }
      }

      toast.success(
        data.isSavedByCurrentUser
          ? `Saved "${playlistName}" to your library`
          : `Removed "${playlistName}" from your library`,
      );
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save the playlist");
    }
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
    <div className="mt-8 space-y-12">
      {createdItems && createdItems.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <ListMusic className="w-6 h-6 text-[#1db954]" />
            <h3 className="text-2xl font-bold text-white">Created Playlists</h3>
            <span className="text-sm text-gray-500">
              ({createdItems.length})
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {createdItems.map((playlist) => (
              <div
                key={playlist.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/collection/playlist/${playlist.id}`)}
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-[#181818] mb-3 shadow-md group-hover:shadow-xl transition-all">
                  <img
                    src={
                      playlist.cover
                        ? `${baseURL}/${playlist.cover}`
                        : "/favicon.png"
                    }
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/favicon.png";
                    }}
                  />
                  {!isOwnProfile &&
                    currentUser?.username != playlist.creatorUsername && (
                      <button
                        onClick={(e) =>
                          handleSavePlaylist(e, playlist.id, playlist.name)
                        }
                        className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black/90 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                        title={
                          playlist.isSavedByCurrentUser ? "Unsave" : "Save"
                        }
                      >
                        <Bookmark
                          className={`w-5 h-5 ${
                            playlist.isSavedByCurrentUser
                              ? "fill-[#1db954] text-[#1db954]"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    )}
                </div>
                <p className="text-sm font-semibold text-white truncate group-hover:text-[#1db954] transition-colors">
                  {playlist.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {playlist.creatorName}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {savedItems && savedItems.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Bookmark className="w-6 h-6 text-[#1db954] fill-[#1db954]" />
            <h3 className="text-2xl font-bold text-white">Saved Playlists</h3>
            <span className="text-sm text-gray-500">({savedItems.length})</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedItems.map((playlist) => (
              <div
                key={playlist.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/collection/playlist/${playlist.id}`)}
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-[#181818] mb-3 shadow-md group-hover:shadow-xl transition-all">
                  <img
                    src={
                      playlist.cover
                        ? `${baseURL}/${playlist.cover}`
                        : "/favicon.png"
                    }
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/favicon.png";
                    }}
                  />

                  {currentUser?.username != playlist.creatorUsername && (
                    <button
                      onClick={(e) =>
                        handleSavePlaylist(e, playlist.id, playlist.name)
                      }
                      className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black/90 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                      title={playlist.isSavedByCurrentUser ? "Unsave" : "Save"}
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          playlist.isSavedByCurrentUser
                            ? "fill-[#1db954] text-[#1db954]"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  )}
                </div>
                <p className="text-sm font-semibold text-white truncate group-hover:text-[#1db954] transition-colors">
                  {playlist.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {playlist.creatorName}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {likedSongs && likedSongs.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            <h3 className="text-2xl font-bold text-white">Liked Songs</h3>
            <span className="text-sm text-gray-500">
              ({likedSongs?.length})
            </span>
          </div>

          <div className="space-y-1">
            {likedSongs.map((song, index) => (
              <SongItem
                key={song.id}
                song={{
                  id: song.id,
                  title: song.title,
                  cover: song.cover
                    ? `${baseURL}/${song.cover}`
                    : "/favicon.png",
                  genre: song.genre,
                  link: (song as any).link,
                  releasedBy: song.releasedBy,
                  isLikedByCurrentUser: song.isLikedByCurrentUser,
                }}
                index={index + 1}
                onLikeToggle={() => handleLike(song.id, song.title)}
                isDropdownOpen={openDropdownSongId === song.id}
                onDropdownToggle={setOpenDropdownSongId}
              />
            ))}
          </div>
        </section>
      )}

      {likedAlbums && likedAlbums.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Album className="w-6 h-6 text-[#1db954]" />
            <h3 className="text-2xl font-bold text-white">Liked Albums</h3>
            <span className="text-sm text-gray-500">
              ({likedAlbums.length})
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {likedAlbums.map((album) => (
              <div
                key={album.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/collection/album/${album.id}`)}
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-[#181818] mb-3 shadow-md group-hover:shadow-xl transition-all">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(album.id, album.title);
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black/90 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                    title={album.isLikedByCurrentUser ? "Unlike" : "Like"}
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
                </div>
                <p className="font-semibold text-sm text-white truncate group-hover:text-[#1db954] transition-colors">
                  {album.title}
                </p>
                <p className="text-xs text-gray-400 truncate mt-1">
                  {album.releasedBy}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {likedEntities &&
        likedEntities.length === 0 &&
        (!createdItems || createdItems.length === 0) &&
        (!savedItems || savedItems.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Music className="w-20 h-20 mb-4 opacity-20" />
            <p className="text-lg font-medium">Nothing here yet</p>
            <p className="text-sm mt-2">
              Start exploring music to build your collection
            </p>
          </div>
        )}
    </div>
  );
};

export default ListenerView;

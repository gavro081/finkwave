import { useNavigate } from "react-router-dom";
import { Heart, ListMusic, Music, Album, Bookmark } from "lucide-react";
import type { Playlist, MusicalEntity } from "../../utils/types";
import axiosInstance from "../../api/axiosInstance";
import { useState } from "react";
interface ListenerViewProps {
  likedEntities: MusicalEntity[] | [];
  playlists: Playlist[] | [];
}

const ListenerView = ({ likedEntities, playlists }: ListenerViewProps) => {
  const navigate = useNavigate();
  const [items, setItems] = useState(likedEntities);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({
    message: "",
    show: false,
  });

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast({ message: "", show: false });
    }, 2000);
  };

  const likedSongs = items.filter((e) => e.type === "SONG");
  const likedAlbums = items.filter((e) => e.type === "ALBUM");

  const handleSavePlaylist = (e: React.MouseEvent, playlistId: number) => {
    e.stopPropagation();

    console.log("Save playlist:", playlistId);
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
        data.isLiked ? `Liked "${title}"` : `Removed "${title}" from likes`,
      );
    } catch (err: any) {
      showToast(err.response?.data?.error);
    }
  };

  return (
    <div className="mt-8 space-y-12">
      {toast.show && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium">
            {toast.message}
          </div>
        </div>
      )}
      {playlists && playlists.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <ListMusic className="w-6 h-6 text-gray-700" />
            <h3 className="text-2xl font-bold text-gray-800">
              Created Playlists
            </h3>
            <span className="text-sm text-gray-500">({playlists.length})</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/collection/playlist/${playlist.id}`)}
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3 shadow-md group-hover:shadow-lg transition-all">
                  {playlist.cover ? (
                    <img
                      src={playlist.cover}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <ListMusic className="w-16 h-16 text-white opacity-30" />
                    </div>
                  )}

                  {/* Save button overlay */}
                  <button
                    onClick={(e) => handleSavePlaylist(e, playlist.id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title={playlist.isSavedByCurrentUser ? "Unsave" : "Save"}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        playlist.isSavedByCurrentUser
                          ? "fill-blue-600 text-blue-600"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {playlist.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
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
            <h3 className="text-2xl font-bold text-gray-800">Liked Songs</h3>
            <span className="text-sm text-gray-500">
              ({likedSongs?.length})
            </span>
          </div>

          <div className="space-y-2">
            {likedSongs.map((song, index) => (
              <div
                key={song.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors"
                onClick={() => navigate(`/musical-entity/${song.id}`)}
              >
                <span className="text-gray-500 font-medium w-8 text-center">
                  {index + 1}
                </span>
                <div className="w-12 h-12 rounded bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {song.title}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {song.releasedBy}
                  </p>
                </div>
                <span className="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-full">
                  {song.genre}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(song.id, song.title);
                  }}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 cursor-pointer"
                  title={song.isLikedByCurrentUser ? "Unlike" : "Like"}
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
            ))}
          </div>
        </section>
      )}

      {likedAlbums && likedAlbums.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Album className="w-6 h-6 text-gray-700" />
            <h3 className="text-2xl font-bold text-gray-800">Liked Albums</h3>
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
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 mb-3 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                  <Album className="w-16 h-16 text-white opacity-30" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(album.id, album.title);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                    title={album.isLikedByCurrentUser ? "Unlike" : "Like"}
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
                </div>
                <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {album.title}
                </p>
                <p className="text-xs text-gray-600 truncate mt-1">
                  {album.releasedBy}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {likedEntities &&
        likedEntities.length === 0 &&
        (!playlists || playlists.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
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

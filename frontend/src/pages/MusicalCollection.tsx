import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Song, Album, Playlist } from "../utils/types";
import { handleError } from "../utils/error";
interface CollectionView {
  id: number;
  title: string;
  genre?: string;
  type: string;
  releasedBy: string;
  isLikedByCurrentUser?: boolean;
  songs: Song[];
}

const MusicalCollection = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<CollectionView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeCollection = (
    data: Album | Playlist,
    type: string,
  ): CollectionView => {
    if (type === "album") {
      const album = data as Album;
      return {
        id: album.id,
        title: album.title,
        genre: album.genre,
        type: album.type,
        releasedBy: album.releasedBy,
        isLikedByCurrentUser: album.isLikedByCurrentUser,
        songs: album.songs,
      };
    } else {
      const playlist = data as Playlist;
      return {
        id: playlist.id,
        title: playlist.name,
        genre: undefined,
        type: "PLAYLIST",
        releasedBy: playlist.creatorName,
        isLikedByCurrentUser: undefined,
        songs: playlist.songsInPlaylist,
      };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoint =
          type === "album" ? `/albums/${id}` : `/playlists/${id}`;
        const response = await axiosInstance.get(endpoint);

        const normalized = normalizeCollection(response.data, type!);
        setCollection(normalized);
      } catch (err: any) {
        setError(handleError(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        <h2 className="font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!collection) return null;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
      >
        ← Back
      </button>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-start gap-6 mb-8">
          <div className="shrink-0">
            <div className="w-40 h-40 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
              {collection.title.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="flex-1">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
              {collection.type}
            </span>
            <h1 className="text-4xl font-bold mb-3">{collection.title}</h1>

            <div className="flex items-center gap-3 text-gray-700 mb-4">
              <span className="font-semibold">{collection.releasedBy}</span>
              {collection.genre && (
                <>
                  <span>•</span>
                  <span className="text-gray-600">{collection.genre}</span>
                </>
              )}
              {collection.songs && (
                <>
                  <span>•</span>
                  <span className="text-gray-600">
                    {collection.songs.length} song
                    {collection.songs.length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>

            {type === "album" && (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                aria-label={collection.isLikedByCurrentUser ? "Unlike" : "Like"}
              >
                <svg
                  className="w-5 h-5"
                  fill={collection.isLikedByCurrentUser ? "#ef4444" : "none"}
                  stroke={
                    collection.isLikedByCurrentUser ? "#ef4444" : "#6b7280"
                  }
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {collection.isLikedByCurrentUser ? "Liked" : "Like"}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Songs</h2>

          {collection.songs && collection.songs.length > 0 ? (
            <div className="space-y-2">
              {collection.songs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  <span className="text-gray-500 font-medium w-8 text-center">
                    {index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
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
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    aria-label={song.isLikedByCurrentUser ? "Unlike" : "Like"}
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
          ) : (
            <p className="text-center text-gray-500 py-8">No songs available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicalCollection;

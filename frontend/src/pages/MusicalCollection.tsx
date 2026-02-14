import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance, { baseURL } from "../api/axiosInstance";
import SongItem from "../components/SongItem";
import { getErrorMessage } from "../utils/error";
import type { Album, Playlist, Song } from "../utils/types";
interface CollectionView {
  id: number;
  title: string;
  cover?: string | null;
  genre?: string;
  type: string;
  releasedBy: string;
  isLikedByCurrentUser?: boolean;
  songs: Song[];
}

const MusicalCollection = () => {
  const { type, id } = useParams();
  const [collection, setCollection] = useState<CollectionView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdownSongId, setOpenDropdownSongId] = useState<number | null>(
    null,
  );

  const normalizeCollection = (
    data: Album | Playlist,
    type: string,
  ): CollectionView => {
    if (type === "album") {
      const album = data as Album;
      return {
        id: album.id,
        title: album.title,
        cover: album.cover,
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
        cover: playlist.cover,
        genre: undefined,
        type: "PLAYLIST",
        releasedBy: playlist.creatorName,
        isLikedByCurrentUser: undefined,
        songs: playlist.songsInPlaylist,
      };
    }
  };

  const toggleLike = async (songId: number) => {
    try {
      await axiosInstance.post(`/musical-entity/${songId}/like`);
      setCollection((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          songs: prev.songs.map((s) =>
            s.id === songId
              ? { ...s, isLikedByCurrentUser: !s.isLikedByCurrentUser }
              : s,
          ),
        };
      });
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const toggleCollectionLike = async () => {
    if (!collection) return;
    try {
      await axiosInstance.post(`/musical-entity/${collection.id}/like`);
      setCollection((prev) => {
        if (!prev) return null;
        return { ...prev, isLikedByCurrentUser: !prev.isLikedByCurrentUser };
      });
    } catch (err) {
      console.error("Error toggling collection like:", err);
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
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/10 border-t-[#1db954] rounded-full animate-spin" />
          <p className="text-gray-400 text-lg">Loading collection…</p>
        </div>
      </div>
    );
  }

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

  if (!collection) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] text-white">
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
          {/* Cover art */}
          <div className="w-full md:w-72 shrink-0">
            <div className="relative w-full pt-[100%] rounded-xl overflow-hidden shadow-2xl bg-[#181818]">
              <img
                src={
                  collection.cover
                    ? `${baseURL}/${collection.cover}`
                    : "/favicon.png"
                }
                alt={collection.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/favicon.png";
                }}
              />
            </div>
          </div>

          {/* Collection info */}
          <div className="flex flex-col justify-end gap-3 min-w-0">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              {collection.genre ? `${collection.genre} • ` : ""}
              {collection.type === "PLAYLIST" ? "Playlist" : "Album"}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight truncate">
              {collection.title}
            </h1>

            <p className="text-xl text-gray-300 font-semibold">
              {collection.releasedBy}
            </p>

            {collection.songs && (
              <p className="text-sm text-gray-500">
                {collection.songs.length} song
                {collection.songs.length !== 1 ? "s" : ""}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-4">
              {type === "album" && (
                <button
                  onClick={toggleCollectionLike}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                    collection.isLikedByCurrentUser
                      ? "bg-[#1db954] text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={
                      collection.isLikedByCurrentUser ? "currentColor" : "none"
                    }
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {collection.isLikedByCurrentUser ? "Liked" : "Like"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Songs list */}
        <div className="border-t border-white/10 pt-6">
          <h2 className="text-2xl font-bold mb-4">Songs</h2>

          {collection.songs && collection.songs.length > 0 ? (
            <div className="space-y-1">
              {collection.songs.map((song, index) => (
                <SongItem
                  key={song.id}
                  song={song}
                  index={index + 1}
                  onLikeToggle={() => toggleLike(song.id)}
                  isDropdownOpen={openDropdownSongId === song.id}
                  onDropdownToggle={setOpenDropdownSongId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No songs available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicalCollection;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance, { baseURL } from "../api/axiosInstance";
import PlaylistDropdown from "../components/playlist/PlaylistDropdown";
import AlbumResult from "../components/search/AlbumResult";
import SongResult from "../components/search/SongResult";
import UserResult from "../components/search/UserResult";
import { usePlayer } from "../context/playerContext";
import type {
  Album,
  BaseNonAdminUser,
  SearchCategory,
  Song,
} from "../utils/types";
import { toEmbedUrl } from "../utils/utils";

const CATEGORIES: { value: SearchCategory; label: string }[] = [
  { value: "songs", label: "Songs" },
  { value: "albums", label: "Albums" },
  { value: "artists", label: "Artists" },
  { value: "users", label: "Users" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { play, currentSong } = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // search state
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<SearchCategory>("songs");
  const [searchResults, setSearchResults] = useState<unknown[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // playlist dropdown state
  const [openPlaylistDropdown, setOpenPlaylistDropdown] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axiosInstance.get("/songs/top");
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const toggleLike = async (songId: number) => {
    try {
      await axiosInstance.post(`/musical-entity/${songId}/like`);
      setSongs((prevSongs) =>
        prevSongs.map((song) =>
          song.id === songId
            ? { ...song, isLikedByCurrentUser: !song.isLikedByCurrentUser }
            : song,
        ),
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const togglePlaylistDropdown = (songId: number) => {
    if (openPlaylistDropdown === songId) {
      setOpenPlaylistDropdown(null);
    } else {
      setOpenPlaylistDropdown(songId);
    }
  };

  const performSearch = async (query: string, category: SearchCategory) => {
    if (!query.trim()) return;

    setSearchLoading(true);
    setHasSearched(true);
    setActiveQuery(query);
    setSearchCategory(category);

    try {
      let endpoint = "";
      switch (category) {
        case "songs":
          endpoint = `/songs/search?q=${encodeURIComponent(query)}`;
          break;
        case "albums":
          endpoint = `/albums/search?q=${encodeURIComponent(query)}`;
          break;
        case "artists":
          endpoint = `/users/search?type=ARTIST&q=${encodeURIComponent(query)}`;
          break;
        case "users":
          endpoint = `/users/search?type=LISTENER&q=${encodeURIComponent(query)}`;
          break;
      }

      const response = await axiosInstance.get(endpoint);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = () => {
    performSearch(searchInput, searchCategory);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategorySwitch = (category: SearchCategory) => {
    performSearch(activeQuery, category);
  };

  const clearSearch = () => {
    setSearchInput("");
    setActiveQuery("");
    setHasSearched(false);
    setSearchResults([]);
  };

  const renderResults = () => {
    if (searchLoading) {
      return (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-white/10 border-t-[#1db954] rounded-full animate-spin"></div>
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">
            No {searchCategory} found for "{activeQuery}"
          </p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-white/5">
        {searchResults.map((result, index) => {
          switch (searchCategory) {
            case "songs":
              return (
                <SongResult key={(result as Song).id} song={result as Song} />
              );
            case "albums":
              return (
                <AlbumResult
                  key={(result as Album).id}
                  album={result as Album}
                />
              );
            case "artists":
              return (
                <UserResult
                  key={(result as BaseNonAdminUser).username ?? index}
                  user={result as BaseNonAdminUser}
                  label="Artist"
                />
              );
            case "users":
              return (
                <UserResult
                  key={(result as BaseNonAdminUser).username ?? index}
                  user={result as BaseNonAdminUser}
                  label="User"
                />
              );
          }
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] text-white flex">
      <div className="flex-1">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="mb-8 flex flex-col md:flex-row gap-3">
              <div className="flex flex-1 gap-0">
                {/* Category Dropdown */}
                <select
                  value={searchCategory}
                  onChange={(e) =>
                    setSearchCategory(e.target.value as SearchCategory)
                  }
                  className="bg-[#282828] border border-white/10 border-r-0 rounded-l-full py-2 px-4 text-white text-sm focus:outline-none focus:border-[#1db954] appearance-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder={`Search ${searchCategory}...`}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-[#282828] border border-white/10 border-r-0 py-2 px-4 text-white focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-all"
                />

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="bg-[#1db954] hover:bg-[#1ed760] text-black font-medium px-6 rounded-r-full transition-colors flex items-center gap-2"
                >
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

            {/* Search Results Section */}
            {hasSearched ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    Results for "{activeQuery}"
                  </h2>
                  <button
                    onClick={clearSearch}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Clear search
                  </button>
                </div>

                {/* Quick category switch buttons */}
                <div className="flex gap-2 mb-6">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategorySwitch(cat.value)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        searchCategory === cat.value
                          ? "bg-[#1db954] text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Results list */}
                <div className="bg-[#1a1a2e]/50 rounded-xl overflow-hidden">
                  {renderResults()}
                </div>
              </div>
            ) : (
              /* Default song grid */
              <>
                <div className="mb-8 border-b border-white/10 pb-6">
                  <h1 className="text-5xl font-bold mb-3 pb-1 bg-linear-to-r from-[#1db954] to-[#1ed760] bg-clip-text text-transparent">
                    Top Songs
                  </h1>
                  <p className="text-xl text-gray-400">
                    Listen to the newest tracks on FinkWave
                  </p>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-[#1db954] rounded-full animate-spin"></div>
                    <p className="text-xl text-gray-400">Loading songs...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-8 py-4">
                    {songs.map((song) => (
                      <div
                        key={song.id}
                        onClick={() => navigate(`/songs/${song.id}`)}
                        onMouseEnter={() => {
                          if (
                            openPlaylistDropdown !== null &&
                            openPlaylistDropdown !== song.id
                          ) {
                            setOpenPlaylistDropdown(null);
                          }
                        }}
                        className="bg-[#282828] rounded-xl cursor-pointer shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl group relative"
                      >
                        <div className="relative w-full pt-[100%] overflow-hidden bg-[#181818] rounded-t-xl">
                          <img
                            src={
                              song.cover
                                ? `${baseURL}/${song.cover}`
                                : "/favicon.png"
                            }
                            alt={song.title}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/favicon.png";
                            }}
                          />
                          <div className="absolute top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {song.link ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  play({
                                    id: song.id,
                                    title: song.title,
                                    artist: song.releasedBy,
                                    cover: song.cover,
                                    embedUrl: toEmbedUrl(song.link!),
                                  });
                                }}
                                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-[0_4px_12px_rgba(29,185,84,0.5)] transition-all cursor-pointer ${
                                  currentSong?.id === song.id
                                    ? "bg-white text-[#1db954]"
                                    : "bg-[#1db954] text-black hover:scale-105"
                                }`}
                                aria-label={
                                  currentSong?.id === song.id
                                    ? "Now playing"
                                    : "Play song"
                                }
                              >
                                {currentSong?.id === song.id ? (
                                  <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                  </svg>
                                ) : (
                                  <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                )}
                              </button>
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-[#1db954] flex items-center justify-center text-xl text-black shadow-[0_4px_12px_rgba(29,185,84,0.5)]">
                                ▶
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2 text-white overflow-hidden text-ellipsis whitespace-nowrap">
                            {song.title}
                          </h3>
                          {song.album && (
                            <p
                              onClick={(e) => {
                                e.stopPropagation();
                                if (song.albumId) {
                                  navigate(`/collection/album/${song.albumId}`);
                                }
                              }}
                              className={`text-sm text-gray-400 mb-3 overflow-hidden text-ellipsis whitespace-nowrap ${
                                song.albumId
                                  ? "hover:underline cursor-pointer hover:text-white"
                                  : ""
                              }`}
                            >
                              {song.album}
                            </p>
                          )}
                          <p
                            onClick={(e) => {
                              e.stopPropagation();
                              if (song.artistUsername) {
                                navigate(`/users/${song.artistUsername}`);
                              }
                            }}
                            className={`text-sm text-gray-400 mb-3 overflow-hidden text-ellipsis whitespace-nowrap ${
                              song.artistUsername
                                ? "hover:underline cursor-pointer hover:text-white"
                                : ""
                            }`}
                          >
                            {song.releasedBy}
                          </p>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                            {/* Like button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(song.id);
                              }}
                              className="text-gray-400 hover:text-[#1db954] transition-colors cursor-pointer"
                              aria-label={
                                song.isLikedByCurrentUser
                                  ? "Unlike song"
                                  : "Like song"
                              }
                            >
                              {song.isLikedByCurrentUser ? (
                                <svg
                                  className="w-6 h-6 fill-[#1db954]"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                              ) : (
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                              )}
                            </button>

                            {/* Add to playlist button */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlaylistDropdown(song.id);
                                }}
                                className="text-gray-400 hover:text-[#1db954] transition-colors cursor-pointer"
                                aria-label="Add to playlist"
                              >
                                <svg
                                  className="w-6 h-6"
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
                              </button>

                              <PlaylistDropdown
                                songId={song.id}
                                isOpen={openPlaylistDropdown === song.id}
                                onClose={() => setOpenPlaylistDropdown(null)}
                                direction="above"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../api/axiosInstance";
import { usePlayer } from "../context/playerContext";
import { toEmbedUrl } from "../utils/utils";
import PlaylistDropdown from "./playlist/PlaylistDropdown";

export interface SongItemData {
  id: number;
  title: string;
  cover?: string | null;
  genre?: string;
  link?: string | null;
  releasedBy?: string;
  isLikedByCurrentUser?: boolean;
}

interface SongItemProps {
  song: SongItemData;
  /** Optional label shown before the artist, e.g. "Song" for search results */
  label?: string;
  /** Optional role badge for artist contributions, e.g. "PERFORMER" */
  role?: string;
  /** Optional index number for playlist/collection views */
  index?: number;
  /** Callback when the like button is clicked */
  onLikeToggle?: (songId: number) => void;
  /** Controlled: whether the playlist dropdown is open */
  isDropdownOpen?: boolean;
  /** Controlled: callback when dropdown should open/close */
  onDropdownToggle?: (songId: number | null) => void;
}

const ROLE_COLORS: { [key: string]: string } = {
  COMPOSER: "bg-purple-500/20 text-purple-300",
  PERFORMER: "bg-blue-500/20 text-blue-300",
  PRODUCER: "bg-green-500/20 text-green-300",
  MAIN_VOCAL: "bg-pink-500/20 text-pink-300",
};

const SongItem = ({
  song,
  label,
  role,
  index,
  onLikeToggle,
  isDropdownOpen,
  onDropdownToggle,
}: SongItemProps) => {
  const navigate = useNavigate();
  const { play, currentSong } = usePlayer();
  const [internalOpen, setInternalOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownDirection, setDropdownDirection] = useState<"above" | "below">(
    "below",
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  const playlistOpen = isDropdownOpen ?? internalOpen;
  const setPlaylistOpen = (open: boolean) => {
    if (onDropdownToggle) {
      onDropdownToggle(open ? song.id : null);
    } else {
      setInternalOpen(open);
    }
  };

  const isPlaying = currentSong?.id === song.id;

  const subtitleParts: string[] = [];
  if (label) subtitleParts.push(label);
  if (song.releasedBy) subtitleParts.push(song.releasedBy);
  const subtitle = subtitleParts.join(" • ");

  return (
    <div
      onClick={() => navigate(`/songs/${song.id}`)}
      onMouseEnter={() => {
        if (onDropdownToggle && !playlistOpen) {
          onDropdownToggle(null);
        }
      }}
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
    >
      {/* Optional index */}
      {index != null && (
        <span className="text-gray-500 font-medium w-8 text-center text-sm shrink-0">
          {index}
        </span>
      )}

      {/* Cover */}
      <img
        src={song.cover ? `${baseURL}/${song.cover}` : "/favicon.png"}
        alt={song.title}
        className="w-12 h-12 rounded object-cover shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/favicon.png";
        }}
      />

      {/* Title & subtitle */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium truncate ${
            isPlaying ? "text-[#1db954]" : "text-white"
          }`}
        >
          {song.title}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-400 truncate">{subtitle}</p>
        )}
      </div>

      {/* Role badge (artist contributions) */}
      {role && (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium hidden sm:block ${
            ROLE_COLORS[role] || "bg-white/10 text-gray-300"
          }`}
        >
          {role.replace("_", " ")}
        </span>
      )}

      {/* Genre */}
      {song.genre && (
        <span className="text-xs text-gray-500 uppercase tracking-wider mr-2 hidden sm:block">
          {song.genre}
        </span>
      )}

      {/* Play button */}
      {song.link && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            play({
              id: song.id,
              title: song.title,
              artist: song.releasedBy || "",
              cover: song.cover,
              embedUrl: toEmbedUrl(song.link!),
            });
          }}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            isPlaying
              ? "bg-white text-[#1db954] opacity-100"
              : "bg-[#1db954] text-black hover:scale-110 opacity-0 group-hover:opacity-100"
          }`}
          aria-label={isPlaying ? "Now playing" : "Play song"}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}

      {/* Like button */}
      {onLikeToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle(song.id);
          }}
          className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
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
      )}

      {/* Three-dot menu */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation();
            if (playlistOpen) {
              setPlaylistOpen(false);
            } else {
              if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                const dropdownHeight = 260;

                if (spaceBelow < dropdownHeight) {
                  setDropdownDirection("above");
                  setDropdownPosition({
                    top: rect.top - 8,
                    left: rect.right - 224,
                  });
                } else {
                  setDropdownDirection("below");
                  setDropdownPosition({
                    top: rect.bottom + 8,
                    left: rect.right - 224,
                  });
                }
              }
              setPlaylistOpen(true);
            }
          }}
          className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-white"
          aria-label="More options"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        <PlaylistDropdown
          songId={song.id}
          isOpen={playlistOpen}
          onClose={() => setPlaylistOpen(false)}
          position={dropdownPosition}
          usePortal={true}
          direction={dropdownDirection}
        />
      </div>
    </div>
  );
};

export default SongItem;

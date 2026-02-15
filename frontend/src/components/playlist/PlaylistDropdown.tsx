import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axiosInstance from "../../api/axiosInstance";
import { useCreatedPlaylists } from "../../context/playlistContext";
import CreatePlaylistModal from "./CreatePlaylistModal";

interface PlaylistDropdownProps {
  songId: number;
  isOpen: boolean;
  onClose: () => void;
  position?: { top: number; left: number };

  usePortal?: boolean;

  direction?: "above" | "below";
}

const PlaylistDropdown = ({
  songId,
  isOpen,
  onClose,
  position,
  usePortal = false,
  direction = "above",
}: PlaylistDropdownProps) => {
  const { createdPlaylists, refreshPlaylists } = useCreatedPlaylists();
  const [containingPlaylistIds, setContainingPlaylistIds] = useState<number[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && songId) {
      const fetchPlaylistIds = async () => {
        setLoading(true);
        setContainingPlaylistIds([]);
        try {
          const response = await axiosInstance.get<number[]>(
            `/playlists/song/${songId}`,
          );
          setContainingPlaylistIds(response.data);
        } catch (error) {
          console.error("Failed to fetch song presence:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPlaylistIds();
    } else {
      setContainingPlaylistIds([]);
    }
  }, [isOpen, songId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleTogglePlaylist = async (playlistId: number, songId: number) => {
    if (processingIds.has(playlistId)) return;

    setProcessingIds((prev) => new Set(prev).add(playlistId));

    try {
      const response = await axiosInstance.post<{
        playlistId: number;
        isSongAddedToPlaylist: boolean;
      }>(`/playlists/${playlistId}/song/${songId}`);

      const { playlistId: returnedPlaylistId, isSongAddedToPlaylist } =
        response.data;

      if (isSongAddedToPlaylist) {
        setContainingPlaylistIds((prev) =>
          prev.includes(returnedPlaylistId)
            ? prev
            : [...prev, returnedPlaylistId],
        );
      } else {
        setContainingPlaylistIds((prev) =>
          prev.filter((id) => id !== returnedPlaylistId),
        );
      }
    } catch (error) {
      console.error("Failed to toggle playlist:", error);
    } finally {
      refreshPlaylists(true);
      setTimeout(() => {
        setProcessingIds((prev) => {
          const next = new Set(prev);
          next.delete(playlistId);
          return next;
        });
      }, 500);
    }
  };

  const handleCreateNew = () => {
    onClose();
    setIsModalOpen(true);
  };

  const handleModalSuccess = async () => {
    await refreshPlaylists(false);
  };

  const inlinePositionClass =
    direction === "below"
      ? "absolute left-0 top-full mt-2"
      : "absolute right-0 bottom-full mb-2";

  const dropdownContent = !isOpen ? null : (
    <div
      ref={dropdownRef}
      className={`${usePortal ? "fixed" : inlinePositionClass} w-56 bg-[#282828] rounded-lg shadow-2xl py-2 z-9999 border border-white/10 max-h-60 overflow-y-auto custom-scrollbar`}
      style={
        usePortal && position
          ? {
              top: position.top,
              left: position.left,
              transform:
                direction === "below" ? undefined : "translateY(-100%)",
            }
          : undefined
      }
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 mb-1">
        Add to playlist
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="w-5 h-5 border-2 border-white/10 border-t-[#1db954] rounded-full animate-spin"></div>
        </div>
      ) : createdPlaylists && createdPlaylists.length > 0 ? (
        createdPlaylists.map((playlist) => {
          const isProcessing = processingIds.has(playlist.id);
          const isChecked = containingPlaylistIds.includes(playlist.id);

          return (
            <label
              key={playlist.id}
              className={`flex items-center gap-1.5 px-4 py-2 hover:bg-white/10 transition-colors group/item ${
                isProcessing ? "pointer-events-none" : "cursor-pointer"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex items-center justify-center  shrink-0">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={isChecked}
                  disabled={isProcessing}
                  onChange={() => handleTogglePlaylist(playlist.id, songId)}
                />
                <div
                  className={`w-5 h-5 border-2 rounded bg-[#181818] transition-all ${
                    isProcessing
                      ? "border-[#1db954] animate-pulse"
                      : isChecked
                        ? "bg-[#1db954] border-[#1db954]"
                        : "border-gray-500 text=wjot"
                  }`}
                >
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 border-2 border-transparent border-t-[#1db954] rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <svg
                  className={`absolute w-3 h-3 transition-opacity ${
                    isChecked && !isProcessing ? "opacity-100" : "opacity-0"
                  }`}
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span
                className={`text-sm truncate transition-all ${
                  isProcessing
                    ? "text-[#1db954] animate-pulse"
                    : "text-gray-200 group-hover/item:text-white"
                }`}
              >
                {playlist.name}
              </span>
            </label>
          );
        })
      ) : (
        <div className="px-4 py-3 text-sm text-gray-500 italic">
          No playlists created
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCreateNew();
        }}
        className="w-full text-left px-4 py-2 mt-1 text-sm text-[#1db954] hover:bg-white/5 transition-colors border-t border-white/5 flex items-center gap-2 font-medium cursor-pointer"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create new playlist
      </button>
    </div>
  );

  const dropdown = dropdownContent
    ? usePortal
      ? createPortal(dropdownContent, document.body)
      : dropdownContent
    : null;

  return (
    <>
      {dropdown}
      {createPortal(
        <CreatePlaylistModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
          songId={songId}
        />,
        document.body,
      )}
    </>
  );
};

export default PlaylistDropdown;

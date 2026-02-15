import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import type { CreatePlaylistModalProps } from "../../utils/types";

const CreatePlaylistModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreatePlaylistModalProps) => {
  const [playlistName, setPlaylistName] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setPlaylistName("");
      setError("");
      setIsOpening(true);
      setTimeout(() => setIsOpening(false), 10);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await axiosInstance.post(
        `/playlists?playlistName=${encodeURIComponent(playlistName.trim())}`,
      );
      toast.success("Playlist created successfully!");
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create playlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-opacity duration-200 ${
        isClosing || isOpening ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-[#181818] rounded-xl p-8 w-full max-w-md border border-white/10 transition-all duration-200 ${
          isClosing || isOpening
            ? "scale-95 opacity-0"
            : "scale-100 opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create Playlist</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="playlistName"
            >
              Playlist Name
            </label>
            <input
              type="text"
              id="playlistName"
              autoFocus
              className={`w-full bg-[#282828] border rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none transition-all ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-white/10 focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954]"
              }`}
              placeholder="Enter playlist name"
              value={playlistName}
              onChange={(e) => {
                setPlaylistName(e.target.value);
              }}
            />
            <div
              className={`overflow-hidden transition-all duration-200 ease-out ${
                error ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-sm text-red-400 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#282828] rounded-full text-white font-semibold hover:bg-[#3a3a3a] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!playlistName.trim() || isSubmitting}
              className="flex-1 py-3 bg-[#1db954] rounded-full text-black font-semibold hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1db954] cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;

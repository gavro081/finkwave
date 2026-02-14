import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance, { baseURL } from "../api/axiosInstance";
import PlaylistDropdown from "../components/PlaylistDropdown";
import { useAuth } from "../context/authContext";
import { usePlayer } from "../context/playerContext";
import type { SongDetail as SongDetailType } from "../utils/types";
import { toEmbedUrl } from "../utils/utils";

const ROLE_LABELS: Record<string, string> = {
  MAIN_VOCAL: "Main Vocal",
  FEATURED: "Featured",
  PRODUCER: "Producer",
  SONGWRITER: "Songwriter",
  COMPOSER: "Composer",
  MIXER: "Mixer",
  ENGINEER: "Engineer",
};

const formatRole = (role: string): string => {
  return ROLE_LABELS[role] || role.replace(/_/g, " ");
};

const renderStars = (grade: number) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= grade ? "text-yellow-400" : "text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const SongDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { play, currentSong } = usePlayer();
  const [song, setSong] = useState<SongDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  console.log(user);
  useEffect(() => {
    const fetchSong = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/songs/${id}/details`);
        setSong(response.data);
      } catch (err) {
        console.error("Error fetching song details:", err);
        setError("Failed to load song details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSong();
  }, [id]);

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      // todo: replace with toast
      alert("Please select a rating");
      return;
    }
    try {
      await axiosInstance.post(`reviews/${song?.id}`, {
        grade: reviewRating,
        comment: reviewComment,
      });
      const response = await axiosInstance.get(`/songs/${id}/details`);
      setSong(response.data);
    } catch (err) {
      // todo: replace with toast
      console.error("Error submitting review:", err);
    } finally {
      setShowReviewModal(false);
      setReviewRating(0);
      setReviewComment("");
      setHoverRating(0);
    }
  };

  const deleteReview = async () => {
    try {
      await axiosInstance.delete(`reviews/${song?.id}`);
      const response = await axiosInstance.get(`/songs/${id}/details`);
      setSong(response.data);
    } catch (err) {
      toast.error("Failed to delete review");
      console.error("Error deleting review:", err);
    }
  };

  const toggleLike = async () => {
    if (!song) return;
    try {
      await axiosInstance.post(`/musical-entity/${song.id}/like`);
      setSong((prev) =>
        prev
          ? { ...prev, isLikedByCurrentUser: !prev.isLikedByCurrentUser }
          : prev,
      );
    } catch (err) {
      toast.error("Failed to toggle like");
      console.error("Error toggling like:", err);
    }
  };

  const handleCreateNewPlaylist = () => {
    console.log(`Creating new playlist for song ${song?.id}`);
    // TODO: actual playlist creation
    setShowPlaylistDropdown(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/10 border-t-[#1db954] rounded-full animate-spin" />
          <p className="text-gray-400 text-lg">Loading song…</p>
        </div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1e1e2e] to-[#0f0f1e] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">
            {error ?? "Song not found"}
          </p>
          <Link to="/" className="text-[#1db954] hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const otherContributors = song.contributions.filter(
    (c) => c.artistName !== song.releasedBy,
  );

  const avgRating =
    song.reviews.length > 0
      ? (
          song.reviews.reduce((sum, r) => sum + r.grade, 0) /
          song.reviews.length
        ).toFixed(1)
      : null;

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
                src={song.cover ? `${baseURL}/${song.cover}` : "/favicon.png"}
                alt={song.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/favicon.png";
                }}
              />
            </div>
          </div>

          {/* Song info */}
          <div className="flex flex-col justify-end gap-3 min-w-0">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              {song.genre} • Song
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight truncate">
              {song.title}
            </h1>

            {/* Main artist */}
            <p className="text-xl text-gray-300 font-semibold">
              {song.releasedBy}
            </p>

            {/* Album */}
            {song.album && (
              <p className="text-sm text-gray-500">
                Album: <span className="text-gray-300">{song.album}</span>
              </p>
            )}

            {/* Rating summary */}
            {avgRating && (
              <div className="flex items-center gap-2 mt-1">
                {renderStars(Math.round(Number(avgRating)))}
                <span className="text-sm text-gray-400">
                  {avgRating} · {song.reviews.length}{" "}
                  {song.reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-4">
              {/* Play button */}
              {song.link && (
                <button
                  onClick={() =>
                    play({
                      id: song.id,
                      title: song.title,
                      artist: song.releasedBy,
                      cover: song.cover,
                      embedUrl: toEmbedUrl(song.link!),
                    })
                  }
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                    currentSong?.id === song.id
                      ? "bg-white text-[#1db954]"
                      : "bg-[#1db954] text-black hover:bg-[#1ed760] hover:scale-105"
                  }`}
                >
                  {currentSong?.id === song.id ? (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                      Now Playing
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Play Song
                    </>
                  )}
                </button>
              )}

              {user && (
                <>
                  <button
                    onClick={toggleLike}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                      song.isLikedByCurrentUser
                        ? "bg-[#1db954] text-black"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {song.isLikedByCurrentUser ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                    {song.isLikedByCurrentUser ? "Liked" : "Like"}
                  </button>

                  {/* Add to Playlist button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowPlaylistDropdown((prev) => !prev)}
                      className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add to Playlist
                    </button>

                    <PlaylistDropdown
                      songId={song.id}
                      isOpen={showPlaylistDropdown}
                      onClose={() => setShowPlaylistDropdown(false)}
                      onCreateNewPlaylist={handleCreateNewPlaylist}
                      direction="below"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Credits / Contributions */}
        {song.contributions.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Credits</h2>
            <div className="bg-[#1a1a2e]/60 rounded-xl p-5 divide-y divide-white/5">
              {/* Main artist first */}
              {song.contributions
                .filter((c) => c.artistName === song.releasedBy)
                .map((c, i) => (
                  <div
                    key={`main-${i}`}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1db954] rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {c.artistName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">
                          {c.artistName}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                      {formatRole(c.role)}
                    </span>
                  </div>
                ))}

              {/* Other contributors */}
              {otherContributors.map((c, i) => (
                <div
                  key={`contrib-${i}`}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {c.artistName.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-gray-300 font-medium">{c.artistName}</p>
                  </div>
                  <span className="text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                    {formatRole(c.role)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              Reviews
              {song.reviews.length > 0 && (
                <span className="text-base font-normal text-gray-500 ml-2">
                  ({song.reviews.length})
                </span>
              )}
            </h2>
            <button
              onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-2 bg-[#1db954] hover:bg-[#1ed760] text-black text-sm font-semibold px-4 py-2 rounded-full transition-colors"
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
              Add Review
            </button>
          </div>

          {song.reviews.length === 0 ? (
            <div className="bg-[#1a1a2e]/60 rounded-xl p-10 text-center">
              <p className="text-gray-500 text-lg">No reviews yet.</p>
              <p className="text-gray-600 text-sm mt-1">
                Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {song.reviews.map((review) => (
                <div
                  key={`${review.id.listenerId}-${review.id.musicalEntityId}`}
                  className="bg-[#1a1a2e]/60 rounded-xl p-5 hover:bg-[#1a1a2e]/80 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 font-semibold text-sm">
                          {review.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {review.author}
                        </p>
                        {renderStars(review.grade)}
                      </div>
                    </div>
                    {user?.username === review.authorUsername && (
                      <button
                        onClick={deleteReview}
                        className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10"
                        title="Delete review"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mt-3 pl-12">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Add Review</h3>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewRating(0);
                  setReviewComment("");
                  setHoverRating(0);
                }}
                className="text-gray-400 hover:text-white transition-colors"
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

            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Rating <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-10 h-10 ${
                        star <= (hoverRating || reviewRating)
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Comment <span className="text-gray-500">(optional)</span>
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your thoughts about this song..."
                rows={4}
                className="w-full bg-[#0f0f1e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1db954] transition-colors resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewRating(0);
                  setReviewComment("");
                  setHoverRating(0);
                }}
                className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={reviewRating === 0}
                className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#1db954] hover:bg-[#1ed760] text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongDetail;

import { useNavigate } from "react-router-dom";
import { Music, Disc3 } from "lucide-react";
import type { ArtistContribution } from "../../utils/types";

interface ArtistViewProps {
  contributions: ArtistContribution[];
}

const ArtistView = ({ contributions }: ArtistViewProps) => {
  const navigate = useNavigate();

  const albums = contributions.filter((c) => c.entityType === "ALBUM");
  const songs = contributions.filter((c) => c.entityType === "SONG");

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      COMPOSER: "bg-purple-500",
      PERFORMER: "bg-blue-500",
      PRODUCER: "bg-green-500",
      MAIN_VOCAL: "bg-pink-500",
    };
    return colors[role] || "bg-gray-500";
  };

  return (
    <div className="mt-8">
      {albums.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Disc3 className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold">Albums</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() =>
                  navigate(`/musical-entity/${album.musicalEntityId}`)
                }
              >
                <div className="relative aspect-square bg-linear-to-br from-purple-400 via-pink-400 to-blue-400 rounded-lg mb-3 overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Disc3 className="w-20 h-20 text-white opacity-40" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full text-white ${getRoleColor(album.role)}`}
                    >
                      {album.role.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
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
            <Music className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Songs</h2>
          </div>
          <div className="space-y-2">
            {songs.map((song, index) => (
              <div
                key={index}
                className="group flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-200"
                onClick={() =>
                  navigate(`/musical-entity/${song.musicalEntityId}`)
                }
              >
                <div className="shrink-0 w-14 h-14 bg-linear-to-br from-blue-400 to-cyan-400 rounded flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors truncate">
                    {song.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {song.genre}
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-white text-sm font-medium ${getRoleColor(song.role)} shadow-md`}
                >
                  {song.role.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {contributions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Music className="w-24 h-24 mb-4 opacity-20" />
          <p className="text-xl font-medium">No contributions yet</p>
          <p className="text-sm mt-2">Start creating music to see it here</p>
        </div>
      )}
    </div>
  );
};

export default ArtistView;

import { useNavigate } from "react-router-dom";
import { Heart, ListMusic, Music, Album } from "lucide-react";
import type { Playlist, MusicalEntityDTO } from "../../utils/types";

interface ListenerViewProps {
  likedEntities: MusicalEntityDTO[];
  playlists?: Playlist[];
}

const ListenerView = ({ likedEntities, playlists }: ListenerViewProps) => {
  const navigate = useNavigate();

  const likedSongs = likedEntities.filter((e) => e.type === "SONG");
  const likedAlbums = likedEntities.filter((e) => e.type === "ALBUM");

  return (
    <div className="mt-8 space-y-12">
      {playlists && playlists.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 pb-2 border-b-2 border-gray-200">
            <ListMusic className="w-6 h-6 text-gray-700" />
            <h3 className="text-2xl font-bold text-gray-800">My Playlists</h3>
            <span className="text-sm text-gray-400 ml-1">
              ({playlists.length})
            </span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/playlist/${playlist.id}`)}
              >
                <div className="aspect-square rounded-md overflow-hidden bg-gray-100 mb-2 relative shadow-sm group-hover:shadow-lg transition-all">
                  {playlist.cover ? (
                    <img
                      src={playlist.cover}
                      alt={playlist.name}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <ListMusic className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                  {playlist.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {likedSongs.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 pb-2 border-b-2 border-gray-200">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            <h3 className="text-2xl font-bold text-gray-800">Liked Songs</h3>
            <span className="text-sm text-gray-400 ml-1">
              ({likedSongs.length})
            </span>
          </div>

          <div className="space-y-1">
            {likedSongs.map((song, index) => (
              <div
                key={song.id}
                className="flex items-center gap-4 p-3 rounded hover:bg-gray-50 cursor-pointer group transition-colors"
                onClick={() => navigate(`/musical-entity/${song.id}`)}
              >
                <span className="text-sm text-gray-400 w-8 text-right font-medium">
                  {index + 1}
                </span>
                <div className="w-12 h-12 rounded bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                  <Music className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                    {song.title}
                  </p>
                  <p className="text-xs text-gray-500">{song.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {likedAlbums.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 pb-2 border-b-2 border-gray-200">
            <Album className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-800">Liked Albums</h3>
            <span className="text-sm text-gray-400 ml-1">
              ({likedAlbums.length})
            </span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {likedAlbums.map((album) => (
              <div
                key={album.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/musical-entity/${album.id}`)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 mb-3 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                  <Album className="w-16 h-16 text-blue-600 opacity-60" />
                </div>
                <p className="font-medium text-sm text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                  {album.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{album.genre}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {likedEntities.length === 0 && (!playlists || playlists.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-300">
          <p className="text-lg font-medium text-gray-400">Nothing here yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Start exploring music to build your collection
          </p>
        </div>
      )}
    </div>
  );
};

export default ListenerView;

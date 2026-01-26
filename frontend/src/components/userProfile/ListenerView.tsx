import { useNavigate } from "react-router-dom";

interface MusicalEntityDTO {
  id: number;
  title: string;
  genre: string;
  type: string;
}

interface Playlist {
  id: number;
  name: string;
  cover: string;
  creatorName: string;
}

interface ListenerViewProps {
  likedEntities: MusicalEntityDTO[];
  playlists?: Playlist[];
}

const ListenerView = ({ likedEntities, playlists }: ListenerViewProps) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 border-t pt-6 space-y-10">
      {/* --- PLAYLISTS SECTION --- */}
      <section>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>My Playlists</span>
          <span className="text-sm font-normal text-gray-400">
            ({playlists?.length})
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {playlists?.map((playlist) => (
            <div
              key={playlist.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/playlist/${playlist.id}`)}
            >
              {/* Playlist Cover Container */}
              <div className="aspect-square relative overflow-hidden rounded-xl shadow-md bg-gray-200 mb-3">
                {playlist.cover ? (
                  <img
                    src={playlist.cover}
                    alt={playlist.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-300 to-gray-400 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  </div>
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-blue-500 p-3 rounded-full text-white shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {playlist.name}
              </h4>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Playlist
              </p>
            </div>
          ))}

          {playlists?.length === 0 && (
            <div className="col-span-full py-8 border-2 border-dashed border-gray-200 rounded-xl text-center">
              <p className="text-gray-400">No playlists created yet</p>
            </div>
          )}
        </div>
      </section>

      {/* --- LIKED MUSIC SECTION --- */}
      <section>
        <h3 className="text-2xl font-bold mb-4">Liked Music</h3>
        <div className="grid gap-2">
          {likedEntities.map((entity) => (
            <div
              key={entity.id}
              className="p-4 bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 hover:bg-white transition-all cursor-pointer group shadow-xs"
              onClick={() => navigate(`/musical-entity/${entity.id}`)}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="font-semibold text-gray-800 group-hover:text-blue-600">
                    {entity.title}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{entity.genre}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                    entity.type === "SONG"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {entity.type}
                </span>
              </div>
            </div>
          ))}
        </div>
        {likedEntities.length === 0 && (
          <p className="text-gray-500 text-center py-4 italic">
            No liked music yet
          </p>
        )}
      </section>
    </div>
  );
};

export default ListenerView;

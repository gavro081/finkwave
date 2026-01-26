import { useNavigate } from "react-router-dom";

interface ArtistContributionDTO {
  musicalEntityId: number;
  title: string;
  role: string;
  entityType: string;
}

interface ArtistViewProps {
  contributions: ArtistContributionDTO[];
}

const ArtistView = ({ contributions }: ArtistViewProps) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-2xl font-bold mb-4">Contributions</h2>
      <div className="grid gap-3">
        {contributions.map((contribution, index) => (
          <div
            key={index}
            className="p-4 border rounded hover:shadow-md transition-shadow cursor-pointer"
            onClick={() =>
              navigate(`/musical-entity/${contribution.musicalEntityId}`)
            }
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-semibold text-lg">{contribution.title}</p>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {contribution.musicalEntityId}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {contribution.role}
                </span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {contribution.entityType}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {contributions.length === 0 && (
        <p className="text-gray-500 text-center py-4">No contributions yet</p>
      )}
    </div>
  );
};

export default ArtistView;

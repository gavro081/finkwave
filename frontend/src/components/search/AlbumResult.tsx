import { useNavigate } from "react-router-dom";
import { baseURL } from "../../api/axiosInstance";
import type { Album } from "../../utils/types";

interface AlbumResultProps {
	album: Album;
}

const AlbumResult = ({ album }: AlbumResultProps) => {
	const navigate = useNavigate();

	return (
		<div
			onClick={() => navigate(`/collection/album/${album.id}`)}
			className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
		>
			<img
				src={album.cover ? `${baseURL}/${album.cover}` : "/favicon.png"}
				alt={album.title}
				className="w-12 h-12 rounded object-cover"
				onError={(e) => {
					(e.target as HTMLImageElement).src = "/favicon.png";
				}}
			/>
			<div className="flex-1 min-w-0">
				<p className="text-white font-medium truncate">{album.title}</p>
				<p className="text-sm text-gray-400 truncate">
					Album • {album.releasedBy}
				</p>
			</div>
			<span className="text-xs text-gray-500 uppercase tracking-wider">
				{album.genre}
			</span>
		</div>
	);
};

export default AlbumResult;

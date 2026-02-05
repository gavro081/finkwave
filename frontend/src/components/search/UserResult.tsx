import { baseURL } from "../../api/axiosInstance";
import type { BaseNonAdminUser } from "../../utils/types";

interface UserResultProps {
	user: BaseNonAdminUser;
	label: "Artist" | "User";
}

const UserResult = ({ user, label }: UserResultProps) => {
	return (
		<div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
			{user.profilePhoto ? (
				<img
					src={`${baseURL}/${user.profilePhoto}`}
					alt={user.username}
					className="w-12 h-12 rounded-full object-cover"
				/>
			) : (
				<div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
					<span className="text-white text-lg font-semibold">
						{user.username.charAt(0).toUpperCase()}
					</span>
				</div>
			)}
			<div className="flex-1 min-w-0">
				<p className="text-white font-medium truncate">{user.fullName}</p>
				<p className="text-sm text-gray-400 truncate">
					{label} • @{user.username}
				</p>
			</div>
			<div className="text-right text-xs text-gray-500">
				<p>{user.followers} followers</p>
			</div>
		</div>
	);
};

export default UserResult;

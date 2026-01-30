import { useNavigate } from "react-router-dom";
import type { BaseNonAdminUser } from "../../utils/types";

interface ModalProps {
  title: string;
  users: BaseNonAdminUser[];
  onClose: () => void;
  onFollowToggle: (targetId: number) => Promise<void>;
}

const UserListModal = ({
  title,
  users,
  onClose,
  onFollowToggle,
}: ModalProps) => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-1">
          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No users found.</p>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div
                  className="flex items-center gap-4 cursor-pointer flex-1"
                  onClick={() => {
                    onClose();
                    navigate(`/users/${u.id}`);
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {u.profilePhoto ? (
                      <img
                        src={`${baseURL}/${u.profilePhoto}`}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <span className="text-blue-600 font-bold">
                        {u.fullName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900">{u.fullName}</p>
                </div>

                <button
                  onClick={() => onFollowToggle(u.id)}
                  className={`px-4 py-1 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                    u.isFollowedByCurrentUser
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {u.isFollowedByCurrentUser ? "Unfollow" : "Follow"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default UserListModal;

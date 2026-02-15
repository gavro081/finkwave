import { useNavigate } from "react-router-dom";
import { baseURL } from "../../api/axiosInstance";
import type { BaseNonAdminUser } from "../../utils/types";
import { useEffect } from "react";

interface ModalProps {
  title: string;
  users: BaseNonAdminUser[];
  onClose: () => void;
  onFollowToggle: (targetUsername: string) => Promise<void>;
}

const UserListModal = ({
  title,
  users,
  onClose,
  onFollowToggle,
}: ModalProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl cursor-pointer transition-colors"
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
                key={u.username}
                className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors"
              >
                <div
                  className="flex items-center gap-4 cursor-pointer flex-1"
                  onClick={() => {
                    onClose();
                    navigate(`/users/${u.username}`);
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#282828] overflow-hidden shrink-0 flex items-center justify-center">
                    {u.profilePhoto ? (
                      <img
                        src={`${baseURL}/${u.profilePhoto}`}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <span className="text-[#1db954] font-bold">
                        {u.fullName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{u.fullName}</p>
                    <p className="text-sm text-gray-400">@{u.username}</p>
                  </div>
                </div>

                <button
                  onClick={() => onFollowToggle(u.username)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors cursor-pointer ${
                    u.isFollowedByCurrentUser
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-[#1db954] text-black hover:bg-[#1ed760]"
                  }`}
                >
                  {u.isFollowedByCurrentUser ? "Following" : "Follow"}
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

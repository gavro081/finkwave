import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  fullName: string;
}

const AllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:8080/users/all");
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleUserClick = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>
      <div className="grid gap-4">
        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => handleUserClick(u.id)}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg hover:bg-gray-50 cursor-pointer transition-all"
          >
            <h2 className="text-xl font-semibold">{u.fullName}</h2>
            <p className="text-gray-600">@{u.username}</p>
            <p className="text-gray-600">{u.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;

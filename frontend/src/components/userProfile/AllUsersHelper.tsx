import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  fullName: string;
}

const AllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchedUser, setSearchedUser] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/users/search?name=${searchedUser}`,
      );
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (users.length == 0) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-10">
        <input
          type="text"
          value={searchedUser}
          onChange={(e) => setSearchedUser(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Search for a user..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

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

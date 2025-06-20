import React, { useContext, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { UsersAPI } from "../../services/API/Users";
import { StoreContext } from "../../context/StoreContext";

type User = {
  id: string;
  username: string;
};

const UserAccounts = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { token } = useContext(StoreContext); 

  const fetchUsers = async () => {
    try {
      const response = await UsersAPI.getAllUsers(token);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await UsersAPI.deleteUser(userId, token);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

   useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">User Accounts</h2>
      <div className="grid grid-cols-1 gap-4 w-full">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow w-full"
            >
              <span className="text-lg font-medium text-gray-800">
                {user.username}
              </span>
              <button
                onClick={() => handleDelete(user.id)}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserAccounts;

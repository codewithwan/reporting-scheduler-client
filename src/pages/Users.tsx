import { useEffect, useState } from 'react';
import { fetchUsers } from '../services/api';
import { UserData } from '../models/UserData';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetchUsers();
        const sortedUsers = response.data.sort((a: UserData, b: UserData) => {
          const roleOrder = ['SUPERADMIN', 'ADMIN', 'ENGINEER'];
          return roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role);
        });
        setUsers(sortedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    getUsers();
  }, []);

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    // Implement edit logic here
  };

  const handleDelete = (userId: string) => {
    // Implement delete logic here
  };

  const handleCreateUser = () => {
    // Implement create user logic here
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="min-h-screen px-4 pt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Users</h1>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search users..."
              className="px-4 py-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
              onClick={handleCreateUser}
            >
              Create User
            </button>
          </div>
        </div>
        <div className={`overflow-x-auto ${filteredUsers.length > 5 ? 'block' : 'hidden'}`}>
          <table className="table-auto w-full text-left border-collapse border border-gray-200 shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-200">Name</th>
                <th className="px-4 py-2 border border-gray-200">Role</th>
                <th className="px-4 py-2 border border-gray-200">Email</th>
                <th className="px-4 py-2 border border-gray-200">Timezone</th>
                <th className="px-4 py-2 border border-gray-200">Created At</th>
                <th className="px-4 py-2 border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200">{user.name}</td>
                  <td className="px-4 py-2 border border-gray-200">{user.role}</td>
                  <td className="px-4 py-2 border border-gray-200">{user.email}</td>
                  <td className="px-4 py-2 border border-gray-200">{user.timezone}</td>
                  <td className="px-4 py-2 border border-gray-200">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        className="flex items-center px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => handleEdit(user)}
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button
                        className="flex items-center px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={`overflow-x-auto ${filteredUsers.length <= 5 ? 'block' : 'hidden'}`}>
          <table className="table-auto w-full text-left border-collapse border border-gray-200 shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-200">Name</th>
                <th className="px-4 py-2 border border-gray-200">Role</th>
                <th className="px-4 py-2 border border-gray-200">Email</th>
                <th className="px-4 py-2 border border-gray-200">Timezone</th>
                <th className="px-4 py-2 border border-gray-200">Created At</th>
                <th className="px-4 py-2 border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200">{user.name}</td>
                  <td className="px-4 py-2 border border-gray-200">{user.role}</td>
                  <td className="px-4 py-2 border border-gray-200">{user.email}</td>
                  <td className="px-4 py-2 border border-gray-200">{user.timezone}</td>
                  <td className="px-4 py-2 border border-gray-200">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        className="flex items-center px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => handleEdit(user)}
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button
                        className="flex items-center px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default Users;

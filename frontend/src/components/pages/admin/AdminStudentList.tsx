// src/components/admin/UsersList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import Swal from 'sweetalert2';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string; 
  isBlocked: boolean;
}

//to make date as DD/MM/YYYY
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/adminStudentsList');
      setUsers(response.data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const toggleUserBlockStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to ${currentStatus ? 'unblock' : 'block'} this user?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!'
      });

      if (result.isConfirmed) {
        const response = await axios.put(`http://localhost:8000/api/admin/toggleUserBlockStatus/${userId}`);
        console.log("Server response:", response.data);
        Swal.fire(
          'Updated!',
          `User has been ${currentStatus ? 'unblocked' : 'blocked'}.`,
          'success'
        );
        fetchUsers(); // Refresh the user list
      }
    } catch (error: any) {
      Swal.fire(
        'Error!',
        'There was an error updating the user status.',
        'error'
      );
      setError(error.message);
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="py-8">
            <h2 className="text-2xl font-semibold leading-tight">Users(Students)</h2>
            <div className="overflow-x-auto bg-white shadow-md rounded">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{user.name}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{formatDate(user.createdAt)}</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
      <button
        onClick={() => toggleUserBlockStatus(user._id, user.isBlocked)}
        className={`px-4 py-2 rounded ${
          user.isBlocked
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {user.isBlocked ? 'Blocked' : 'Normal'}
      </button>
    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


export default UsersList;

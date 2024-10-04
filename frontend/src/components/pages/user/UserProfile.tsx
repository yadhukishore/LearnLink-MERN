import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { RootState } from '../../store/store';
import Header from './HeaderUser';
import { loginSuccess } from '../../../features/auth/authSlice'; // Adjust the import path as needed
import { apiService } from '../../../services/api';

interface IUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!userId) {
          throw new Error('User ID not found');
        }
        const response = await apiService.get<{ user: IUser }>(`/user/userProfile/${userId}`);
        setUser(response.user);
        setEditedName(response.user.name);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to fetch user profile');
        setLoading(false);
      }
    };

    if (token && userId) {
      fetchUserProfile();
    }
  }, [token, userId]);

  const handleEdit = async () => {
    try {
      const response = await apiService.patch<{ user: IUser }>(
        `/user/updateProfile/${userId}`,
        { name: editedName }
      );
      setUser(response.user);
      setIsEditing(false);

      dispatch(
        loginSuccess({
          token: token!,
          user: {
            id: response.user._id,
            name: response.user.name,
            email: response.user.email,
          },
        })
      );

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Your name has been updated successfully.',
      });
    } catch (err) {
      console.error('Error updating user profile:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update your name. Please try again.',
      });
    }
  };

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!user) return <div className="text-white text-center mt-10">User profile not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071A2B] to-[#1A3A5A] text-white">
      <Header />
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0C2D48] shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                {isEditing ? (
                  <div className="flex">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-[#1A3A5A] text-white p-2 rounded-l flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleEdit}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r transition duration-300"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <p className="bg-[#1A3A5A] text-white p-2 rounded-l flex-grow">{user.name}</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r transition duration-300"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p className="bg-[#1A3A5A] text-white p-2 rounded">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Member Since</label>
                <p className="bg-[#1A3A5A] text-white p-2 rounded">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
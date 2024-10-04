import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { RootState } from '../../store/store';
import Header from './HeaderUser';
import { loginSuccess } from '../../../features/auth/authSlice';
import { apiService } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

interface IUser {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        if (!userId) {
          throw new Error('User ID not found');
        }
        const response = await apiService.get<{ user: IUser }>(`/user/userProfile/${userId}`);
        setUser(response.user);
        setEditedName(response.user.name);
        setPreviewUrl(response.user.profilePicture || '/default-profile-picture.png');
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
  }, [token, userId, navigate]);

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editedName);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await apiService.patch<{ user: IUser }>(
        `/user/updateProfile/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUser(response.user);
      setIsEditing(false);
      setPreviewUrl(response.user.profilePicture || '/default-profile-picture.png');

      dispatch(
        loginSuccess({
          token: token!,
          user: {
            id: response.user._id,
            name: response.user.name,
            email: response.user.email,
            profilePicture: response.user.profilePicture,
          },
        })
      );

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Your profile has been updated successfully.',
      });
    } catch (err) {
      console.error('Error updating user profile:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update your profile. Please try again.',
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPicture = () => {
    fileInputRef.current?.click();
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
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <img
                    src={previewUrl || '/default-profile-picture.png'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <button
                    onClick={handleEditPicture}
                    className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
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
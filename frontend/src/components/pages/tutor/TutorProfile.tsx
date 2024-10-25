import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import TutorHeader from './TutorHeader';
import Swal from 'sweetalert2';
import TutorProfileShimmer from '../../helpers/TutorProfileShimmer';
import { tutorLoginSuccess, checkTutorAuthStatus } from '../../../features/tutor/tutorSlice';
import { apiService } from '../../../services/api';



const TutorProfile: React.FC = () => {
  const [tutor, setTutor] = useState<ITutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.tutor.token);
  const tutorFromRedux = useSelector((state: RootState) => state.tutor.tutor);
  const dispatch = useDispatch();
  interface ITutor {
    _id: string;
    name: string;
    email: string;
    subjects: string[];
    description: string;
  }
  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        // First check auth status, similar to TutorWallet
        await dispatch(checkTutorAuthStatus());

        if (tutorFromRedux?.id) {
          const response = await apiService.get<{ tutor: ITutor }>('/tutor/tutorProfile', {
            params: { tutorId: tutorFromRedux.id },
            headers: { 'Tutor-Id': tutorFromRedux.id }  // Add this header for consistency
          });

          setTutor(response.tutor);
          setError(null);
        } else {
          setError('Tutor ID is not available.');
        }
      } catch (err) {
        console.error('Error fetching tutor profile:', err);
        setError('Failed to fetch tutor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchTutorProfile();
  }, [dispatch, tutorFromRedux?.id]);

  const handleEdit = async (field: string, value: string | string[]) => {
    try {
      const response = await apiService.patch<{ tutor: ITutor }>(
        '/tutor/updateProfile',
        {
          tutorId: tutorFromRedux?.id,
          [field]: value,
        },
        {
          headers: { 'Tutor-Id': tutorFromRedux?.id }  
        }
      );

      setTutor(response.tutor);

      if (field === 'name') {
        dispatch(
          tutorLoginSuccess({
            token: token!,
            tutor: {
              id: response.tutor._id,
              name: response.tutor.name,
              email: response.tutor.email,
            },
          })
        );
      }

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `${field} has been updated successfully.`,
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Failed to update ${field}`,
      });
    }
  };
  
  if (loading) return <TutorProfileShimmer />;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!tutor) return <div className="text-white text-center mt-10">Tutor profile not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071A2B] to-[#1A3A5A] text-white">
      <TutorHeader />
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0C2D48] shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Tutor Profile</h1>
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={tutor.name}
                    onChange={(e) => setTutor({ ...tutor, name: e.target.value })}
                    className="bg-[#1A3A5A] text-white p-2 rounded-l w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleEdit('name', tutor.name)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r transition duration-300"
                  >
                    Edit
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="text"
                  value={tutor.email}
                  readOnly
                  className="bg-[#1A3A5A] text-white p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <div className="flex items-start">
                  <textarea
                    value={tutor.description}
                    onChange={(e) => setTutor({ ...tutor, description: e.target.value })}
                    className="bg-[#1A3A5A] text-white p-2 rounded-l w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleEdit('description', tutor.description)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r transition duration-300"
                  >
                    Edit
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subjects</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={tutor.subjects.join(', ')}
                    onChange={(e) => setTutor({ ...tutor, subjects: e.target.value.split(',').map(s => s.trim()) })}
                    className="bg-[#1A3A5A] text-white p-2 rounded-l w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleEdit('subjects', tutor.subjects)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r transition duration-300"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TutorProfile;

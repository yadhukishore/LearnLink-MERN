import React, { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Modal from '../../Modal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Tutor {
  _id: string;
  name: string;
  email: string;
  subjects: string[];
  proofs: {
    teacherProof: string;
    qualifications: string;
    experienceProofs: string;
  };
  description: string;
  isApprovedByAdmin: boolean;
}

const TutorDetails: React.FC = () => {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const { tutorId } = useParams<{ tutorId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const response = await apiService.get<Tutor>(`/admin/tutor-details/${tutorId}`);
        setTutor(response);
      } catch (error) {
        console.error('Error fetching tutor details:', error);
      }
    };
    fetchTutorDetails();
  }, [tutorId]);
  const handleApproval = async (approve: boolean) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: `You are about to ${approve ? 'approve' : 'decline'} this tutor.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, cancel!',
      preConfirm: () => {
        MySwal.showLoading();
        return apiService.post(`/admin/approve-tutor/${tutorId}`, { approve })
          .then(() => {
            MySwal.fire(
              'Email Sent!',
              `Tutor has been ${approve ? 'approved' : 'declined'} and an email has been sent.`,
              'success'
            );
            navigate('/adminApprove-tutor');
          })
          .catch((error) => {
            console.error('Error updating tutor approval status:', error);
            MySwal.fire(
              'Error!',
              'There was an error updating the tutor approval status.',
              'error'
            );
          });
      }
    });
  };

  const openModal = (proofUrl: string) => {
    setSelectedProof(proofUrl);
  };

  const closeModal = () => {
    setSelectedProof(null);
  };

  if (!tutor) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Tutor Details</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{tutor.name}</h2>
            <p className="mb-2">Email: {tutor.email}</p>
            <p className="mb-2">Subjects: {tutor.subjects.join(', ')}</p>
            <p className="mb-4">Description: {tutor.description}</p>

            <h3 className="text-lg font-semibold mb-2">Proofs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div onClick={() => openModal(tutor.proofs.teacherProof)}>
                <h4 className="font-medium mb-1">Teacher Proof</h4>
                <img src={tutor.proofs.teacherProof} alt="Teacher Proof" className="w-full h-48 object-cover rounded cursor-pointer" />
              </div>
              <div onClick={() => openModal(tutor.proofs.qualifications)}>
                <h4 className="font-medium mb-1">Qualifications</h4>
                <img src={tutor.proofs.qualifications} alt="Qualifications" className="w-full h-48 object-cover rounded cursor-pointer" />
              </div>
              <div onClick={() => openModal(tutor.proofs.experienceProofs)}>
                <h4 className="font-medium mb-1">Experience Proofs</h4>
                <img src={tutor.proofs.experienceProofs} alt="Experience Proofs" className="w-full h-48 object-cover rounded cursor-pointer" />
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => handleApproval(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              >
                Approve
              </button>
              <button
                onClick={() => handleApproval(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Decline
              </button>
            </div>
          </div>
        </main>
      </div>

      <Modal isOpen={!!selectedProof} onClose={closeModal}>
        {selectedProof && (
          <div className="w-full h-full">
            <img src={selectedProof} alt="Proof" className="w-full h-full object-contain" />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TutorDetails;

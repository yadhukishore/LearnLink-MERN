import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const SubmitProofs: React.FC = () => {
  const [certifications, setCertifications] = useState<File | null>(null);
  const [qualifications, setQualifications] = useState<File | null>(null);
  const [experienceProofs, setExperienceProofs] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const { tutorId } = useParams<{ tutorId: string }>();

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>) => (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  useEffect(() => {
    const validateForm = () => {
      return certifications && qualifications && experienceProofs && description.trim() !== '';
    };
    setIsFormValid(validateForm());
  }, [certifications, qualifications, experienceProofs, description]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await MySwal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit these proofs?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      console.log('Submitting proofs...');
      const formData = new FormData();
      formData.append('certifications', certifications!);
      formData.append('qualifications', qualifications!);
      formData.append('experienceProofs', experienceProofs!);
      formData.append('description', description);

      try {
        await axios.post(`http://localhost:8000/api/tutor/submit-tutor-proofs/${tutorId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        MySwal.fire('Submitted!', 'Your proofs have been submitted.', 'success');
        navigate('/waiting-for-approval');
      } catch (error) {
        console.error('Error submitting proofs:', error);
        MySwal.fire('Error', 'There was an issue submitting your proofs. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-fuchsia-500 via-pink-300 to-blue-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-6">
        <div className="flex items-center mb-6">
          <img src="https://www.svgrepo.com/show/295402/user-profile.svg" alt="Profile" className="w-16 h-16 rounded-full mr-4" />
          <h2 className="text-2xl font-bold">Upload your certifications</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proofs as a teacher</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FontAwesomeIcon icon={faUpload} className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">{certifications ? certifications.name : 'Upload file'}</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange(setCertifications)} />
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FontAwesomeIcon icon={faUpload} className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">{qualifications ? qualifications.name : 'Upload file'}</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange(setQualifications)} />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" 
              rows={4}
              placeholder="Type here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Proofs</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FontAwesomeIcon icon={faUpload} className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">{experienceProofs ? experienceProofs.name : 'Add Links here'}</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileChange(setExperienceProofs)} />
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full text-white font-bold py-2 px-4 rounded-lg transition duration-300 ${isFormValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Register and Wait
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProofs;

import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import imageCompression from 'browser-image-compression';

const MySwal = withReactContent(Swal);

const SubmitProofs: React.FC = () => {
  const [teacherProof, setTeacherProof] = useState<File | null>(null);
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
  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };
  useEffect(() => {
    const validateForm = (): boolean => {
      return !!(teacherProof && qualifications && experienceProofs && description.trim() !== '');
    };
    setIsFormValid(validateForm());
  }, [teacherProof, qualifications, experienceProofs, description]);
  
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

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
      
      if (teacherProof) {
        formData.append('teacherProof', teacherProof);
        console.log('Teacher Proof:', teacherProof.name, teacherProof.type, teacherProof.size);
      } else {
        console.log('Teacher Proof is missing');
      }
      
      if (qualifications) {
        formData.append('qualifications', qualifications);
        console.log('Qualifications:', qualifications.name, qualifications.type, qualifications.size);
      } else {
        console.log('Qualifications is missing');
      }
      
      if (experienceProofs) {
        formData.append('experienceProofs', experienceProofs);
        console.log('Experience Proofs:', experienceProofs.name, experienceProofs.type, experienceProofs.size);
      } else {
        console.log('Experience Proofs is missing');
      }
      
      formData.append('description', description);
      console.log('Description:', description);
  
      console.log('Tutor ID:', tutorId);
  
  
      try {
         const compressedTeacherProof = teacherProof ? await compressImage(teacherProof) : null;
         const compressedQualifications = qualifications ? await compressImage(qualifications) : null;
         const compressedExperienceProofs = experienceProofs ? await compressImage(experienceProofs) : null;
 

         const teacherProofBase64 = compressedTeacherProof ? await fileToBase64(compressedTeacherProof) : null;
         const qualificationsBase64 = compressedQualifications ? await fileToBase64(compressedQualifications) : null;
         const experienceProofsBase64 = compressedExperienceProofs ? await fileToBase64(compressedExperienceProofs) : null;
      
      const data = {
        teacherProof: teacherProofBase64,
        qualifications: qualificationsBase64,
        experienceProofs: experienceProofsBase64,
        description
      };
      console.log('Data being sent:', JSON.stringify(data));
      console.log('Sending request to:', `http://localhost:8000/api/tutor/submit-tutor-proofs/${tutorId}`);
      const response = await axios.post(`http://localhost:8000/api/tutor/submit-tutor-proofs/${tutorId}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Server response:', response.data);
      MySwal.fire('Submitted!', 'Your proofs have been submitted.', 'success');
      navigate('/waiting-for-approval');
      } catch (error) {
        console.error('Error submitting proofs:', error);
        if (axios.isAxiosError(error) && error.response) {
          console.error('Server error response:', error.response.data);
        }
        MySwal.fire('Error', 'There was an issue submitting your proofs. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-fuchsia-500 via-pink-300 to-blue-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-6">
        <div className="flex items-center mb-6">
          <img src="https://www.svgrepo.com/show/295402/user-profile.svg" alt="Profile" className="w-16 h-16 rounded-full mr-4" />
          <h2 className="text-2xl font-bold">Upload Images of your proofs</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proofs as a teacher</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FontAwesomeIcon icon={faUpload} className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">{teacherProof ? teacherProof.name : 'Upload file'}</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange(setTeacherProof)} />
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
                  <p className="mb-2 text-sm text-gray-500">{experienceProofs ? experienceProofs.name : 'Upload file'}</p>
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
              Submit Proofs
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProofs;
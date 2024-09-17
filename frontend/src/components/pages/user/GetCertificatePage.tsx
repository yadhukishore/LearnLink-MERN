import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { apiService } from '../../../services/api';
import Header from './HeaderUser';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CourseDetails {
  title: string;
}

const GetCertificatePage: React.FC = () => {
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const { courseId } = useParams<{ courseId: string }>();
  const user = useSelector((state: RootState) => state.auth.user);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await apiService.get<CourseDetails>(`/user/getCourseCertificate/${courseId}`);
        setCourseDetails(response);
      } catch (error) {
        console.error('Error fetching course details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch course details. Please try again.',
        });
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${user?.name}_Certificate_${courseDetails?.title}.pdf`);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Certificate downloaded successfully!',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to generate PDF. Please try again.',
      });
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!courseDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800">Your Certificate</h1>
        <div className="bg-white shadow-2xl rounded-lg p-8 mb-8" ref={certificateRef}>
          <div className="border-8 border-double border-purple-500 p-8 relative" style={{ borderRadius: '15px' }}>
            <h2 className="text-5xl font-serif text-center mb-8 text-indigo-800">Certificate of Completion</h2>
            <p className="text-2xl text-center mb-4 text-gray-700">This is to certify that</p>
            <p className="text-4xl font-bold text-center mb-6 text-purple-700 underline">{user?.name}</p>
            <p className="text-2xl text-center mb-6 text-gray-700">has successfully completed the course</p>
            <p className="text-4xl font-bold text-center mb-6 text-indigo-700">{courseDetails.title}</p>
            <p className="text-2xl text-center mb-6 text-gray-700">on</p>
            <p className="text-3xl font-bold text-center mb-12 text-purple-700">{currentDate}</p>
            <div className="text-center mt-12">
              <p className="text-3xl font-serif text-indigo-800">LearnLink</p>
              <p className="text-xl text-gray-600">Empowering Minds, Connecting Futures</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={handleDownload}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-lg text-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-300 shadow-lg"
          >
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetCertificatePage;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { checkTutorAuthStatus } from '../../../features/tutor/tutorSlice';
import TutorHeader from './TutorHeader';
import { motion } from 'framer-motion';
import { apiService } from '../../../services/api';

interface TutorCourse {
  name: string;
  paidEnrollments: number;
}
interface TutorWalletResponse {
  totalAmount: number;
  courses: TutorCourse[];
}

const TutorWallet = () => {
  const dispatch = useDispatch();
  const { tutor } = useSelector((state: RootState) => state.tutor);
  const [totalAmount, setTotalAmount] = useState(0);
  const [courses, setCourses] = useState<TutorCourse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorWalletDetails = async () => {
      try {
        await dispatch(checkTutorAuthStatus());

        if (tutor?.id) {
          const response = await apiService.get<TutorWalletResponse>(`/tutor/tutorWallet`, {
            headers: { 'Tutor-Id': tutor.id },
          });
          setTotalAmount(response.totalAmount);
          setCourses(response.courses);
          setError(null);
        } else {
          setError('Tutor ID is not available.');
        }
      } catch (error) {
        console.error('Error fetching tutor wallet details:', error);
        setError('An error occurred while fetching the wallet details.');
      }
    };

    fetchTutorWalletDetails();
  }, [dispatch, tutor?.id]);


  return (
    <div className="min-h-screen bg-[#071A2B] text-white flex flex-col">
      <TutorHeader />
      <motion.main
        className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="px-4 py-6 sm:px-0">
          <motion.h1
            className="text-4xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Tutor Wallet
          </motion.h1>
          
          {error ? (
            <div className="text-red-400 text-lg font-semibold text-center">{error}</div>
          ) : (
            <>
              <motion.div
                className="mb-12 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-semibold">Total Amount Earned</h2>
                <p className="text-5xl font-bold text-green-400 mt-2 animate-pulse">
  ₹{totalAmount.toFixed(2)}
</p>

              </motion.div>

              <motion.h2
                className="text-2xl font-semibold mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Your Courses
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold">{course.name}</h3>
                    <p className="text-lg mt-2">{course.paidEnrollments} paid enrollments</p>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.main>
      <footer className="bg-opacity-80 backdrop-blur-md py-8 px-6 text-gray-300 text-center">
        <p className="text-lg font-semibold">LearnLink - Empowering Tutors, Enriching Minds.</p>
      </footer>
    </div>
  );
};

export default TutorWallet;

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { checkTutorAuthStatus } from '../../../features/tutor/tutorSlice';

interface TutorCourse {
  name: string;
  paidEnrollments: number;
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
          const response = await axios.get('http://localhost:8000/api/tutor/tutorWallet', {
            headers: { 'Tutor-Id': tutor.id },
          });
          setTotalAmount(response.data.totalAmount);
          setCourses(response.data.courses);
          setError(null); // Clear any previous error
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
    <div>
      <h1>Tutor Wallet</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && (
        <>
          <h2>Total Amount Earned</h2>
          <p>₹{totalAmount.toFixed(2)}</p>
          <h2>Your Courses</h2>
          {courses.map((course, index) => (
            <div key={index}>
              <p>{course.name}</p>
              <p>{course.paidEnrollments} paid enrollments</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TutorWallet;

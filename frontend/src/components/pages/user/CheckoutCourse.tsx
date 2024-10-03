import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Header from './HeaderUser';
import { apiService } from '../../../services/api';

interface CourseDetail {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    public_id: string;
    url: string;
  };
  price: number;
  tutorName: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutCourse: React.FC = () => {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await apiService.get<{ course: CourseDetail }>(`/user/checkoutUserCourse/${courseId}`, {
          params: { userId: user?.id }
        });
        setCourse(response.course);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, user?.id]);

  const handlePayNow = async () => {
    try {
      const response = await apiService.post<{
        amount: number;
        currency: string;
        id: string;
      }>(`/user/create-order`, {
        courseId: course?._id,
        userId: user?.id
      });

      const options = {
       key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: response.amount,
        currency: response.currency,
        name: 'LearnLink',
        description: `Enrollment for ${course?.name}`,
        order_id: response.id,
        handler: function (response: any) {
          handlePaymentSuccess(response);
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#7F66F6'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        // Handle payment failure (e.g., show an error message to the user)
      });
      rzp.open();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      await apiService.post(`/user/verify`, {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        courseId: course?._id,
        userId: user?.id,
        amount: (course?.price ?? 0) * 100,
        currency: 'INR',
        status: 'paid'
      });
      navigate(`/course-videos/${course?._id}`);
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071A2B] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#071A2B] text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Course not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071A2B] text-white">
      <Header />
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        <div className="bg-gray-900 rounded-lg shadow-lg p-8">
          <img src={course?.thumbnail.url} alt={course?.name} className="w-full h-48 object-cover rounded-lg mb-6" />
          <h2 className="text-2xl font-semibold mb-4">{course?.name}</h2>
          <p className="text-gray-300 mb-4">{course?.description}</p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Tutor:</span> {course?.tutorName}
          </p>
          <p className="text-xl font-bold text-yellow-400 mb-6">₹{course?.price.toFixed(2)}</p>
          <button
            onClick={handlePayNow}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          >
            Pay Now
          </button>
        </div>
      </main>
    </div>
  );
};

export default CheckoutCourse;
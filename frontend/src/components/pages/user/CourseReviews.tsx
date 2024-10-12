import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../../../services/api';

interface Review {
  _id: string;
  user: {
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface CourseReviewsProps {
  courseId: string;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiService.get<{ success: boolean; reviews: Review[] }>(
          `user/courseReviews/${courseId}`
        );
        setReviews(response.reviews); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courseId]);


  if (loading) {
    return <div className="text-center">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center text-gray-400">No reviews yet for this course.</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Course Reviews</h2>
      {reviews.map((review) => (
        <motion.div
          key={review._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">{review.user.name}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-5 h-5 ${
                    index < review.rating ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-gray-300">{review.comment}</p>
          <p className="text-sm text-gray-400 mt-2">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default CourseReviews;
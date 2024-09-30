import React, { useState } from 'react';
import { apiService } from '../../../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Swal from 'sweetalert2';
import { Star } from 'lucide-react';

interface FeedbackProps {
  courseId: string;
  onFeedbackSubmitted: () => void;
}

const FeedbackCourse: React.FC<FeedbackProps> = ({ courseId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [showComment, setShowComment] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.auth.user);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
    setShowComment(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Please provide a rating.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const response = await apiService.post(`/user/courseFeedback/${courseId}`, {
        rating,
        comment,
        userId: user?.id
      });
      console.log("Feedback Response:", response);

      if (response && response.message) {
        Swal.fire({
          title: 'Success!',
          text: response.message,
          icon: 'success',
          confirmButtonText: 'OK'
        });

        setRating(0);
        setComment('');
        setShowComment(false);
        if (typeof onFeedbackSubmitted === 'function') {
          onFeedbackSubmitted();
        }
      } else {
        throw new Error('Unexpected response format');
      }

    } catch (error: any) {
      console.error("Error:", error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Error submitting feedback. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-white">Leave Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-medium text-white mb-2">
            Rating
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                onClick={() => handleStarClick(star)}
                className={`cursor-pointer ${
                  star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
                } hover:text-yellow-400 transition-colors duration-200`}
              />
            ))}
          </div>
        </div>
        {showComment && (
          <div className="mb-4">
            <label htmlFor="comment" className="block text-lg font-medium text-white">
              Comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 p-2 rounded-lg bg-gray-700 text-white w-full"
              rows={4}
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackCourse;
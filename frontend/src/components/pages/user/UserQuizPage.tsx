import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface IQuestion {
  _id: string;
  questionText: string;
  options: string[];
}


interface IQuizSubmitResponse {
  message: string;
  score: number;
}

const UserQuizPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await apiService.get<{ questions: IQuestion[] }>(`/user/quiz/${courseId}`);
        console.log("Response Quiz:", response);
        if (response.questions && response.questions.length > 0) {
          setQuestions(response.questions);
          setAnswers(new Array(response.questions.length).fill(-1));
        } else {
          setError('No questions found for this quiz.');
        }
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching quiz:', error);
        setError(error.response?.data?.message || 'Failed to load quiz. Please try again.');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId]);

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleOptionSelect = (optionIndex: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleSubmitQuiz = async () => {
    const result = await Swal.fire({
      title: 'Submit Quiz',
      text: 'Are you sure you want to submit your quiz?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit',
      cancelButtonText: 'No, review answers',
    });

    if (result.isConfirmed) {
      try {
        const formattedAnswers = answers.map((selectedOption, index) => ({
          questionId: questions[index]._id,
          selectedOption,
        }));

        if (!userId) {
          Swal.fire({
            title: 'Error',
            text: 'User ID is missing. Please log in again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          return;
        }

        // Pass userId along with the answers
        const response = await apiService.post<IQuizSubmitResponse>(`/user/quiz/${courseId}/submit`, {
          answers: formattedAnswers,
          userId,  // Add userId to the request body
        });

        console.log("Full Response:", response);
        const score = response?.score ?? 0;
        console.log("Score:", score);
        setScore(score);
        setQuizSubmitted(true);

        await Swal.fire({
          title: 'Quiz Submitted!',
          text: `Your score: ${score} out of ${questions.length}`,
          icon: 'success',
          confirmButtonText: 'OK',
        });

        navigate('/courses');
      } catch (error) {
        console.error('Error submitting quiz:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to submit quiz. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#071A2B] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#071A2B] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error!</h1>
          <p>{error}</p>
          <button
            onClick={() => navigate(`/courses`)}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#071A2B] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Questions Available</h1>
          <p>This quiz doesn't have any questions yet.</p>
          <button
            onClick={() => navigate(`/courses`)}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#071A2B] text-white">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Quiz</h1>
        <div className="mb-6">
          <h2 className="text-xl mb-2">{`${currentQuestionIndex + 1}. ${currentQuestion.questionText}`}</h2>
          <ul className="space-y-2">
            {currentQuestion.options.map((option, optionIndex) => (
              <li key={optionIndex}>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={optionIndex}
                    checked={answers[currentQuestionIndex] === optionIndex}
                    onChange={() => handleOptionSelect(optionIndex)}
                  />
                  <span>{option}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
        {currentQuestionIndex === questions.length - 1 && (
          <button
            onClick={handleSubmitQuiz}
            className="bg-green-600 text-white py-2 px-4 rounded-lg mt-4"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default UserQuizPage;
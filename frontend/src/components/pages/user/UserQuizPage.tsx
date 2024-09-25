import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Header from './HeaderUser';

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
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); 

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmitQuiz = useCallback(async (isAutoSubmit: boolean = false) => {
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

      const response = await apiService.post<IQuizSubmitResponse>(`/user/quiz/${courseId}/submit`, {
        answers: formattedAnswers,
        userId,  
      });

      const score = response?.score ?? 0;
      setScore(score);
      setQuizSubmitted(true);

      if (isAutoSubmit) {
        await Swal.fire({
          title: 'Time\'s Up!',
          text: `Your quiz has been automatically submitted. Your score: ${score} out of ${questions.length}`,
          icon: 'info',
          confirmButtonText: 'OK',
        });
      } else {
        await Swal.fire({
          title: 'Quiz Submitted!',
          text: `Your score: ${score} out of ${questions.length}`,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }

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
  }, [answers, questions, userId, courseId, navigate]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await apiService.get<{ questions: IQuestion[] }>(`/user/quiz/${courseId}`);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmitQuiz(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmitQuiz]);

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

  const handleManualSubmit = async () => {
    const result = await Swal.fire({
      title: 'Submit Quiz',
      text: 'Are you sure you want to submit your quiz?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit',
      cancelButtonText: 'No, review answers',
    });

    if (result.isConfirmed) {
      handleSubmitQuiz();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center bg-red-800 bg-opacity-50 p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Error!</h1>
          <p className="text-xl mb-6">{error}</p>
          <button
            onClick={() => navigate(`/courses`)}
            className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center bg-yellow-800 bg-opacity-50 p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-4">No Questions Available</h1>
          <p className="text-xl mb-6">This quiz doesn't have any questions yet.</p>
          <button
            onClick={() => navigate(`/courses`)}
            className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 text-white">
      <Header />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white bg-opacity-10 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Quiz Time!</h1>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className={`text-sm px-3 py-1 rounded-full ${timeRemaining <= 60 ? 'bg-red-600 animate-pulse' : 'bg-blue-600'}`}>
                  Time remaining: {formatTime(timeRemaining)}
                </span>
              </div>
              <h2 className="text-2xl mb-6">{currentQuestion.questionText}</h2>
              <ul className="space-y-4">
                {currentQuestion.options.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <label className="flex items-center space-x-3 p-4 rounded-lg bg-white bg-opacity-5 hover:bg-opacity-10 transition duration-200 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={optionIndex}
                        checked={answers[currentQuestionIndex] === optionIndex}
                        onChange={() => handleOptionSelect(optionIndex)}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="text-lg">{option}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="bg-gray-600 text-white py-2 px-6 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Previous
              </button>
              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleManualSubmit}
                  className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Next
                </button>
              )}
            </div>
          </div>
          <div className="bg-blue-800 bg-opacity-50 p-4">
            <div className="flex justify-between items-center">
              <span>Progress: {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
              <div className="w-2/3 bg-gray-300 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserQuizPage;
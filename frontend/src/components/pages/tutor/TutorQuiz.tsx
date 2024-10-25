import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import TutorHeader from './TutorHeader';
import { apiService } from '../../../services/api';
import { checkTutorAuthStatus } from '../../../features/tutor/tutorSlice';
import TutorLoginPrompt from '../../notAuthenticatedPages/TutorLoginPrompt';

interface Question {
  questionText: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: string;
  courseId: string;
  questions: Question[];
}

interface ApiResponse {
  message: string;
  quiz: Quiz;
}

const TutorQuiz: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.tutor.token);
  const isAuthenticated = useSelector((state: RootState) => state.tutor.isAuthenticated);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    dispatch(checkTutorAuthStatus());
  }, [dispatch]);


  useEffect(() => {
    fetchQuiz();
  }, [courseId, token]);

  const fetchQuiz = async () => {
    try {
      const response = await apiService.get<ApiResponse>(`/tutor/getQuiz/${courseId}`);
      setQuestions(response.quiz.questions);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestion({ ...currentQuestion, questionText: e.target.value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentQuestion({ ...currentQuestion, correctAnswer: parseInt(e.target.value) });
  };

  const addQuestion = () => {
    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = currentQuestion;
      setQuestions(updatedQuestions);
      setEditingIndex(null);
    } else {
      setQuestions([...questions, currentQuestion]);
    }
    setCurrentQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    });
  };

  const editQuestion = (index: number) => {
    setCurrentQuestion(questions[index]);
    setEditingIndex(index);
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const saveQuiz = async () => {
    try {
      await apiService.post<ApiResponse>(`/tutor/createQuiz/${courseId}`, { questions });
      navigate(`/tutorCourseDetail/${courseId}`);
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };


  if (!isAuthenticated) {
    return <TutorLoginPrompt />;
  }

  return (
    <div className="min-h-screen bg-[#071A2B] text-white">
      <TutorHeader />
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Create Quiz</h1>
        <div className="mb-6">
          <input
            type="text"
            value={currentQuestion.questionText}
            onChange={handleQuestionChange}
            placeholder="Enter question"
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />
          {currentQuestion.options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="w-full p-2 mb-2 bg-gray-700 rounded"
            />
          ))}
          <select
            value={currentQuestion.correctAnswer}
            onChange={handleCorrectAnswerChange}
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          >
            {currentQuestion.options.map((_, index) => (
              <option key={index} value={index}>
                Correct Answer: Option {index + 1}
              </option>
            ))}
          </select>
          <button
            onClick={addQuestion}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
          >
            {editingIndex !== null ? 'Update Question' : 'Add Question'}
          </button>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Quiz Questions</h2>
          {questions.map((q, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-800 rounded">
              <p className="font-bold">Question {index + 1}: {q.questionText}</p>
              <ul className="list-disc list-inside">
                {q.options.map((option, optIndex) => (
                  <li key={optIndex} className={optIndex === q.correctAnswer ? 'text-green-500' : ''}>
                    {option}
                  </li>
                ))}
              </ul>
              <div className="mt-2">
                <button
                  onClick={() => editQuestion(index)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteQuestion(index)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={saveQuiz}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Save Quiz
        </button>
      </main>
    </div>
  );
};

export default TutorQuiz;
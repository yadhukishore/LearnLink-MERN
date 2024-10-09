import { Request, Response } from 'express';
import Quiz from '../../models/Quiz';  
import mongoose from 'mongoose';
import Course from '../../models/Course';

export const getQuizForUser = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;
        console.log(`Entered Quiz of ${courseId}`);

        if (!courseId) {
            return res.status(400).json({ message: 'Course ID is required' });
        }
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid Course ID format' });
        }
        const courseWithQuiz = await Course.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(courseId) }
            },
            {
                $lookup: {
                    from: 'quizzes', 
                    localField: 'quiz', 
                    foreignField: '_id',
                    as: 'quiz'
                }
            },
            {
                $unwind: '$quiz' 
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    'quiz._id': 1,
                    'quiz.questions': 1
                }
            }
        ]);

        if (!courseWithQuiz || courseWithQuiz.length === 0) {
            console.log('Course or Quiz not found');
            return res.status(404).json({ message: 'Course or Quiz not found' });
        }

        const courseData = courseWithQuiz[0];
        console.log('Quiz found:', courseData.quiz);

        res.status(200).json({ questions: courseData.quiz.questions });
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Error fetching quiz', error: (error as Error).message });
    }
};

// Submit quiz answers
export const submitQuizAnswers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId } = req.params;
      const { answers, userId } = req.body;  // Assuming answers is an array of { questionId, selectedOption }, and userId is passed
      console.log(`Answers: ${answers} , CourseId: ${courseId}, user: ${userId}` );
  
      const quiz = await Quiz.findOne({ courseId });
  
      if (!quiz) {
        console.log("Quiz not found");
        res.status(404).json({ message: 'Quiz not found' });
        return;
      }
  
  
      let score = 0;
      quiz.questions.forEach((question, index) => {
        const submittedAnswer = answers[index];
        if (submittedAnswer && question.correctAnswer === submittedAnswer.selectedOption) {
          score++;
        }
      });
  
      const totalQuestions = quiz.questions.length;
      const passingScore = Math.ceil(totalQuestions * 0.6); // 60% passing criteria
      const isPassed = score >= passingScore;  
      console.log("Passing Score:", passingScore);
  
      const userResultExists = quiz.userResults.some(result => result.userId.toString() === userId);
  
      if (userResultExists) {

        await Quiz.updateOne(
          { _id: quiz._id, 'userResults.userId': userId }, 
          {
            $set: {
              'userResults.$.score': score,     
              'userResults.$.isPassed': isPassed 
            }
          }
        );
        console.log("Updated existing user result");
      } else {
        await Quiz.updateOne(
          { _id: quiz._id },
          {
            $push: {
              userResults: {
                userId: new mongoose.Types.ObjectId(userId),
                score,
                isPassed
              }
            }
          }
        );
        console.log("Added new user result");
      }
  
      console.log("Quiz Submitted");
      console.log('Score:', score, 'Passed:', isPassed);
  
      res.status(200).json({ message: 'Quiz submitted successfully', score, isPassed });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      res.status(500).json({ message: 'Error submitting quiz' });
    }
  };


  export const getQuizResult = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const userId = req.query.userId as string;
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      const quiz = await Quiz.findOne({ courseId });
  
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found for this course' });
      }
  
      const userResult = quiz.userResults.find(
        result => result.userId.toString() === userId
      );
  
      if (!userResult) {
        return res.status(404).json({ message: 'Quiz result not found for this user' });
      }
  
      res.json({ isPassed: userResult.isPassed });
    } catch (error) {
      console.error('Error fetching quiz result:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
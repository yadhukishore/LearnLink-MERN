import mongoose, { Document, Schema } from "mongoose";

interface IQuestion extends Document {
  questionText: string;
  options: string[];
  correctAnswer: number;
}

interface IUserResult extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  score: number;
  isPassed: boolean;
}

export interface IQuiz extends Document {
  courseId: mongoose.Schema.Types.ObjectId;
  questions: IQuestion[];
  userResults: IUserResult[];  // Added field to track user quiz results
}

const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
});

const UserResultSchema = new Schema<IUserResult>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  isPassed: { type: Boolean, required: true },
});

const QuizSchema = new Schema<IQuiz>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [QuestionSchema],
  userResults: [UserResultSchema],  // New field to track user results
}, {
  timestamps: true
});

export default mongoose.model<IQuiz>('Quiz', QuizSchema);

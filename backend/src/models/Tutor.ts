import mongoose, { Document, Schema } from 'mongoose';

export interface ITutor extends Document {
  name: string;
  email: string;
  password: string;
  subjects: string[];
  proofs: {
    teacherProof: string;
    qualifications: string;
    experienceProofs: string;
  };
  description: string;
  isApprovedByAdmin: boolean;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TutorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subjects: { type: [String], default: [] },
    proofs: {
      teacherProof: { type: String },
      qualifications: { type: String },
      experienceProofs: { type: String },
    },
    description: { type: String },
    isApprovedByAdmin: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Tutor = mongoose.model<ITutor>('Tutor', TutorSchema);
export default Tutor;
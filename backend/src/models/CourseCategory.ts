// models/courseCategory.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ICategory>('Category', CategorySchema);
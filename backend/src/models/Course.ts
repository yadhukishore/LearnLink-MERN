import mongoose, { Document, Schema } from "mongoose";
import { ICategory } from "./CourseCategory";

interface IComment extends Document {
  user: object;
  comment: string;
}

interface IReview extends Document {
  user: object;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
}

interface IVideo extends Document {
  file: string;
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: {
    public_id: string;
    url: string;
  };
}

export interface ICourse extends Document {
  courseId: string;
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  tags: string;
  level: string;
  demoUrl: string;
  category: ICategory['_id']; 
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
  isDelete: boolean;
  benefits: { title: string }[]; 
  prerequisites: { title: string }[];
  tutorId: mongoose.Schema.Types.ObjectId;
  videos: IVideo[];
}

const CommentSchema = new Schema<IComment>({
  user: Object,
  comment: String
});

const ReviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0
  },
  comment: String,
  commentReplies: [CommentSchema]
});

const LinkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

const CourseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  videoThumbnail: Object,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [LinkSchema],
  suggestion: String,
  questions: [CommentSchema],
});

const BenefitSchema = new Schema({
  title: String,
});

const PrerequisiteSchema = new Schema({
  title: String,
});

const VideoSchema = new Schema<IVideo>({
  file: String,
  title: String,
  description: String,
  videoUrl: String,
  videoThumbnail: {
    public_id: String,
    url: String
  }
});

const CourseSchema = new Schema<ICourse>({
  courseId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  estimatedPrice: Number,
  thumbnail: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  tags: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  demoUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  reviews: [ReviewSchema],
  courseData: [CourseDataSchema],
  ratings: {
    type: Number,
    default: 0
  },
  purchased: {
    type: Number,
    default: 0
  },  
  isDelete: {
    type: Boolean,
    default: false
  },
  benefits: [BenefitSchema], 
  prerequisites: [PrerequisiteSchema], 
  tutorId: {
    type: Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  videos: [VideoSchema]
},
{
  timestamps: true
});

export default mongoose.model<ICourse>('Course', CourseSchema);
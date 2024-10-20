import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profilePicture?: string; 
  createdAt?: Date;
  googleId?:string;
  isBlocked?: boolean;
  wishlist: Schema.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  skipPasswordHashing?: boolean; 
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  googleId: {type:String},
  isBlocked: { type: Boolean, default: false }, 
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });


userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')|| this.skipPasswordHashing) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("Password from model",this.password);
  
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
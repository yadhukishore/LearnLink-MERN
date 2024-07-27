import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';

export const registerUser = async (userData: any) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = new UserModel({
    ...userData,
    password: hashedPassword,
  });
  console.log("user in services",user);
  
  await user.save();
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  return token;
};

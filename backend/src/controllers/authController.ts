import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { sendVerificationEmail } from '../services/emailService'; 
import { generateOTP,verifyOTP } from '../utils/otpUtils'; 
import { generateAndHashPassword } from '../utils/passwordUtils';


const otpStorage: { [email: string]: { otp: string; expires: Date } } = {};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    console.log('Register attempt:', { name, email });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    console.log("OTP:",otp);
    
    otpStorage[email] = { otp, expires: otpExpires };

    await sendVerificationEmail(email, otp);

    res.status(200).json({ message: 'Verification code sent to email' });
  } catch (error) {
    console.error('Server of register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const googleAuth = async (req: Request, res: Response) => {
  console.log('Received request for Google authentication:', req.body);
  try {
    const { name, email, googleId,loginPage } = req.body;
    let user = await User.findOne({ email }) as IUser | null;
    if (!user) {
      const { plainPassword, hashedPassword } = await generateAndHashPassword(); 
      user = new User({
        name,
        email,
        password: hashedPassword,
        googleId
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    } else if (user.googleId === googleId && !loginPage) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    console.log("Google authentication successful:", { token, user });

    res.status(200).json({
      message: 'Google authentication successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Server error during Google authentication:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


export const verifyEmail = async (req: Request, res: Response) => {
  try {
    console.log("On verify email");

    const { email, otp, name, password } = req.body;

    console.log("Received OTP:", otp);
    console.log("Stored OTPs:", otpStorage);
    console.log("Received data:", { email, otp, name, password: password ? "exists" : "missing" });

    
    if (!verifyOTP(email, otp, otpStorage)) {
      console.log("OTP verification failed");
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    console.log("OTP verified successfully");

    const user = new User({
      name,
      email,
      password
    });
    
    console.log("New User:", user);
    await user.save();
    console.log("User saved to DB");
 
    delete otpStorage[email];

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Server error during email verification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//User-LoginPage
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: password ? 'provided' : 'not provided' });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (user.isBlocked) {
      console.log("User is blocked");
      return res.status(403).json({ message: 'This User is Blocked!!!' });
    }
    console.log('User found:', { id: user._id, email: user.email });
    console.log('Stored hashed password:', user.password);
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log("Password match not found");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, userType: 'user' },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' } 
    );
    console.log("Token",token);
    console.log("Successful login");
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//user ForgotPassword

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log('Forgot password attempt:', { email });

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    console.log("OTP:", otp);
    otpStorage[email] = { otp, expires: otpExpires };
    await sendVerificationEmail(email, otp);
    res.status(200).json({ message: 'Password reset OTP sent to email' });
  } catch (error) {
    console.error('Server error during forgot password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyForgotPasswordOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    console.log("Received OTP:", otp);
    console.log("Stored OTPs:", otpStorage);

    if (!verifyOTP(email, otp, otpStorage)) {
      console.log("OTP verification failed");
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    console.log("OTP verified successfully");

  
    delete otpStorage[email];

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Server error during OTP verification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("reset hashed pass:",hashedPassword);
    
    user.password = hashedPassword;
    user.skipPasswordHashing = true;
    await user.save();
    console.log("Reset pass saved");
    

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Server error during password reset:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Tutor from '../models/Tutor';

export const authenticateTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('On TutorAuth');
    console.log("TutorToken",token);

    if (!token) {
      console.log("No token, authorization denied")
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const tutor = await Tutor.findById(decoded.id).select('-password');
    console.log("This is the tutor:",tutor)

    if (!tutor) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = tutor;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
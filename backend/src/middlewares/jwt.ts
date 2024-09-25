import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Tutor, { ITutor } from '../models/Tutor';
import Admin, { IAdmin } from '../models/Admin';
import { AuthenticatedRequest } from '../types/express';

interface JwtPayload {
  id: string;  
  userType: 'user' | 'tutor' | 'admin';
}

// Improved middleware function to authorize based on roles
const authMiddleware = (roles: ('user' | 'tutor' | 'admin')[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        console.log("No token")
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      console.log("Decoded JWT:", decoded);
      if (!roles.includes(decoded.userType)) {
        console.log("Access denied. Insufficient permissions.")
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }

      let user: IUser | ITutor | IAdmin | null = null;
      switch (decoded.userType) {
        case 'user':
          user = await User.findById(decoded.id).select('-password');
          break;
        case 'tutor':
          user = await Tutor.findById(decoded.id).select('-password');
          break;
        case 'admin':
          user = await Admin.findById(decoded.id).select('-password');
          break;
      }

      if (!user) {
        console.log("No user found for id:", decoded.id)
        return res.status(401).json({ message: 'Token is not valid' });
      }

      (req as AuthenticatedRequest).user = user;
      (req as AuthenticatedRequest).userType = decoded.userType;
      console.log("User authenticated, passing control to next handler");
      next();
    } catch (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

export default authMiddleware;
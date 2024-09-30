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

const authMiddleware = (roles: ('user' | 'tutor' | 'admin')[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Authenticating request for roles:", roles);
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        console.log("No token found in request");
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      const decoded = jwt.decode(token) as JwtPayload;

      let jwtSecret: string;
      switch (decoded.userType) {
        case 'user':
          jwtSecret = process.env.JWT_SECRET as string;
          break;
        case 'tutor':
          jwtSecret = process.env.TUTOR_JWT_SECRET as string;
          break;
        case 'admin':
          jwtSecret = process.env.ADMIN_JWT_SECRET as string;
          break;
        default:
          console.log("Invalid userType:", decoded.userType);
          return res.status(403).json({ message: 'Invalid userType' });
      }

      const verifiedDecoded = jwt.verify(token, jwtSecret) as JwtPayload;

      // for route
      if (!roles.includes(verifiedDecoded.userType)) {
        console.log("UserType not allowed:", verifiedDecoded.userType);
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }

      let user: IUser | ITutor | IAdmin | null = null;
      switch (verifiedDecoded.userType) {
        case 'user':
          user = await User.findById(verifiedDecoded.id).select('-password');
          break;
        case 'tutor':
          user = await Tutor.findById(verifiedDecoded.id).select('-password');
          break;
        case 'admin':
          user = await Admin.findById(verifiedDecoded.id).select('-password');
          break;
      }

      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }

      (req as AuthenticatedRequest).user = user;
      (req as AuthenticatedRequest).userType = verifiedDecoded.userType;
      console.log("Authentication successful for user:", verifiedDecoded.id);
      next(); 
    } catch (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

export default authMiddleware;

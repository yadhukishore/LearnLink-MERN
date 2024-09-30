import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  username: string;
  userType: string;
}

const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log("Admin Token:",token)

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || 'jwt_secret_admin') as DecodedToken;

    if (decoded.userType !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    (req as any).admin = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default adminAuthMiddleware;
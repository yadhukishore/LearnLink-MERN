
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// export interface AuthRequest extends Request {
//   user?: { userId: string };
// }

// const authMiddleware = (allowedRoles: ('user' | 'admin' | 'tutor')[]) => (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log('Incoming headers:', req.headers); // Log all headers

//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   console.log('Extracted token:', token); // Check extracted token

//   if (!token) {
//     console.log("Authentication required, token null");
//     return res.status(401).json({ message: 'Authentication required' });
//   }

//   try {
//     const secret = process.env.JWT_SECRET;
//     if (!secret) {
//       console.log("JWT secret is not defined in environment variables");
//       throw new Error('JWT secret is not defined in environment variables');
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, secret) as { userId: string; userType: 'user' | 'admin' | 'tutor' };
//     console.log("Decoded JWT payload:", decoded); // Log decoded token

//     // Check if userType is in the allowed roles
//     if (!allowedRoles.includes(decoded.userType)) {
//       console.log(`Access denied for userType: ${decoded.userType}`);
//       return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
//     }

//     // Attach user details to request object
//     req.userId = decoded.userId;
//     req.userType = decoded.userType;
//     next();
//   } catch (error) {
//     console.error('Token verification error:', error);
//     if (error instanceof jwt.TokenExpiredError) {
//       return res.status(401).json({ message: 'Token has expired' });
//     }
//     if (error instanceof jwt.JsonWebTokenError) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//     return res.status(401).json({ message: 'Authentication error' });
//   }
// };
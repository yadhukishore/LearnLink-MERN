// // src/middlewares/checkBlockedUser.ts

// import { Response, NextFunction } from 'express';
// import User from '../models/User';
// import { AuthRequest } from './authJWT';

// export const checkBlockedUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   if (!req.user) {
//     return res.status(401).json({ message: 'User not authenticated' });
//   }

//   try {
//     const user = await User.findById(req.user.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (user.isBlocked) {
//       return res.status(403).json({ message: 'User is blocked', isBlocked: true });
//     }

//     next();
//   } catch (error) {
//     console.error('Error checking blocked user:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
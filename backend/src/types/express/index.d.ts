// src/types/express/index.d.ts

import { IUser } from '../../models/User';
import { ITutor } from '../../models/Tutor';
import { IAdmin } from '../../models/Admin';

declare global {
  namespace Express {
    interface Request {
      user?: IUser | ITutor | IAdmin;
      userType?: 'user' | 'tutor' | 'admin';
    }
  }
}

export interface AuthenticatedRequest extends Express.Request {
  user: IUser | ITutor | IAdmin;
  userType: 'user' | 'tutor' | 'admin';
}
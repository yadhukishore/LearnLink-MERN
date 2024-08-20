import { Request, Response } from 'express';
import Tutor , {ITutor} from '../../models/Tutor';

declare global {
    namespace Express {
      interface Request {
        user?: ITutor;
      }
    }
  }

  export const getTutorProfile = async (req: Request, res: Response) => {
    try {
        console.log("Getting TutorProfile")
      if (!req.user) {
        console.log("Unauthorized")
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const tutor = await Tutor.findById(req.user._id).select('-password');
      if (!tutor) {
        console.log("Tutor not found")
        return res.status(404).json({ message: 'Tutor not found' });
      }
      res.json({ tutor });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  export const updateTutorProfile = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const tutor = await Tutor.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
      if (!tutor) {
        return res.status(404).json({ message: 'Tutor not found' });
      }
      res.json({ tutor });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
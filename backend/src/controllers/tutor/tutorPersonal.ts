import { Request, Response } from 'express';
import Tutor , {ITutor} from '../../models/Tutor';
// import ScheduledCall from '../../models/ScheduledCall';
import ScheduledTime from '../../models/ScheduledTime';
import Course from '../../models/Course';

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
  export const createAvailableTime = async (req: Request, res: Response) => {
    try {
      const { tutorId, courseId, startTime, endTime } = req.body;
      const newAvailableTime = new ScheduledTime({
        tutorId,
        courseId,
        startTime,
        endTime,
        isBooked: false
      });
      await newAvailableTime.save();
      res.status(201).json({ success: true, message: 'Available time created successfully' });
    } catch (error) {
      console.error('Error creating available time:', error);
      res.status(500).json({ success: false, message: 'Failed to create available time' });
    }
  };
  export const getAllAvailableTimes = async (req: Request, res: Response) => {
    try {
      const { tutorId } = req.params;
      const currentTime = new Date();
      const availableTimes = await ScheduledTime.find({
        tutorId,
        endTime: { $gt: currentTime }
      }).sort({ startTime: 1 });
      res.status(200).json({ success: true, availableTimes });
    } catch (error) {
      console.error('Error fetching all available times:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch available times' });
    }
  };
  
  export const deleteAvailableTime = async (req: Request, res: Response) => {
    try {
      const { timeId } = req.params;
      await ScheduledTime.findByIdAndDelete(timeId);
      res.status(200).json({ success: true, message: 'Available time deleted successfully' });
    } catch (error) {
      console.error('Error deleting available time:', error);
      res.status(500).json({ success: false, message: 'Failed to delete available time' });
    }
  };

  export const takeTheCourses = async (req: Request, res: Response) => {
    try {
      const { tutorId } = req.params;
      const courses = await Course.find({ tutorId }).select('name _id'); 
      res.status(200).json({ success: true, courses });
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch courses' });
    }
  };

  export const getNonExpiredAvailableTimes = async (req: Request, res: Response) => {
    const { tutorId } = req.params;
    try {
        const currentDate = new Date();
        const availableTimes = await ScheduledTime.find({
            tutorId,
            endTime: { $gt: currentDate }, 
        }).populate('courseId','name');

        res.status(200).json({ availableTimes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available times', error });
    }
};
import { Request, Response } from 'express';
import Tutor , {ITutor} from '../../models/Tutor';
// import ScheduledCall from '../../models/ScheduledCall';
import ScheduledTime from '../../models/ScheduledTime';
import Course from '../../models/Course';
import Enrollment from '../../models/Enrollment';
import User from '../../models/User';
// import Chat from '../../models/Chat';



  interface CustomRequest extends Request{
    tutor?:{_id:string};
  }

  export const getTutorProfile = async (req: CustomRequest, res: Response) => {
    try {
      const tutorId = req.headers['tutor-id'];
      
      if (!tutorId) {
        console.log("No Tutor");
        return res.status(400).json({ message: 'No Tutor ID provided' });
      }
  
      const tutor = await Tutor.findById(tutorId).select('-password');
      if (!tutor) {
        return res.status(404).json({ message: 'Tutor not found' });
      }
  
      res.json({ tutor });
    } catch (error) {
      console.error('Error fetching tutor profile:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };


  export const updateTutorProfile = async (req: Request, res: Response) => {
    try {
      const { tutorId, ...updateData } = req.body;
      console.log("Update tutor profile", tutorId, updateData);
  
      if (!tutorId) {
        return res.status(400).json({ message: 'Tutor ID is required' });
      }
  
      const tutor = await Tutor.findByIdAndUpdate(tutorId, updateData, { new: true }).select('-password');
      if (!tutor) {
        console.log("Tutor Not Found")
        return res.status(404).json({ message: 'Tutor not found' });
      }
  
      console.log("Updated tutor:", tutor);
      res.json({ tutor });
    } catch (error) {
      console.error("Error updating tutor profile:", error);
      res.status(500).json({ message: 'Server error', error: error });
    }
  }
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

//Tutor Wallet things...

export const getTutorWalletDetails = async (req: CustomRequest, res: Response) => {
  try {
    const tutorId = req.headers['tutor-id'];
    if (!tutorId) {
      console.log("No Tutor");
      return res.status(400).json({ message: 'No Tutor ID provided' });
    }
    if (!tutorId) {
      console.log("No Tutor");
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const totalEarnings = await Enrollment.aggregate([
      { $match: { courseId: { $in: await Course.find({ tutorId }).distinct('_id') } } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);

    const totalAmount = totalEarnings.length > 0 ? totalEarnings[0].totalAmount : 0;
    const courses = await Course.find({ tutorId }).select('name price');
    const coursesWithEnrollments = await Promise.all(
      courses.map(async (course) => ({
        name: course.name,
        paidEnrollments: await Enrollment.countDocuments({ courseId: course._id, status: 'paid' }),
        earnings: course.price * await Enrollment.countDocuments({ courseId: course._id, status: 'paid' }) // New: Calculate earnings for each course
      }))
    );

    res.json({
      totalAmount,
      courses: coursesWithEnrollments,
    });
  } catch (error) {
    console.error('Error getting tutor wallet details:', error);
    res.status(500).json({ message: 'Error getting tutor wallet details' });
  }
};


// export const TutorChats = async (req: CustomRequest, res: Response) => {
//   const { tutorId } = req.params;

//   try {
//     // Fetch distinct users who have chatted with the tutor
//     const chatUsers = await Chat.find({ tutorId }).distinct('userId'); 

//     const users = await User.find({ _id: { $in: chatUsers } }); // Fetch user details
//     return res.json(users); // Return user details to the client
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Failed to load chat users' });
//   }
// };


// export const getChatHistoryTutor = async (req: Request, res: Response) => {
//   const { tutorId, userId } = req.params;
//   console.log(`Enterd Tutor ${tutorId} and user ${userId}`)

//   try {
//     const chatHistory = await Chat.find({ tutorId, userId }).sort({ createdAt: 1 });
//     return res.json(chatHistory);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Failed to load chat history' });
//   }
// };

export const getTrendingCourses = async (req: Request, res: Response) => {
  try {
    // console.log("getTrendingCourses...page...");
    const trendingCourses = await Course.aggregate([
      {
        $lookup: {
          from: 'reviewcourses',
          localField: '_id',
          foreignField: 'course',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: '$reviews' }, 0] },
              then: { $avg: '$reviews.rating' },
              else: 0,
            },
          },
          reviewCount: { $size: '$reviews' },
          studentCount: {
            $cond: {
              if: { $isArray: '$students' },
              then: { $size: '$students' },
              else: 0,
            },
          },
        },
      },
      {
        $sort: {
          averageRating: -1,
          reviewCount: -1,
          studentCount: -1,
        },
      },
      {
        $limit: 6,
      },
      {
        $project: {
          _id: 1,
          name: 1, 
          level:1,
          averageRating: 1,
          studentCount: 1,
        },
      },
    ]);

    // console.log('TrendingCoursesss: ', trendingCourses);

    res.json(trendingCourses);
  } catch (error) {
    console.error('Error fetching trending courses:', error);
    res.status(500).json({ message: 'Error fetching trending courses' });
  }
};

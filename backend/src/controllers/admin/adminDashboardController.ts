import Course from '../../models/Course';
import Enrollment from '../../models/Enrollment';
import FinancialAid from '../../models/FinancialAid';
import Tutor from '../../models/Tutor';
import User from '../../models/User'; 
import { Request, Response } from 'express';

export const getUserLoginData = async (req: Request, res: Response) => {
  try {
    console.log("Dashboard")
    const loginData = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 } 
        }
      },
      { $sort: { _id: 1 } } 
    ]);
    console.log("Dashboard userLog:- ",loginData)

    res.json(loginData);
  } catch (error) {
    console.error('Error fetching user login data:', error);
    res.status(500).json({ message: 'Failed to fetch user login data' });
  }
};


export const getTutorLoginData = async (req: Request, res: Response) => {
    try {
     
      const loginData = await Tutor.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } } 
      ]);
  
      res.status(200).json(loginData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tutor login data', error });
    }
  };
  
  export const getCoursesCountByCategory = async (req: Request, res: Response) => {
    console.log("getCourseByCategory")
    try {
      const categoryCourseData = await Course.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            category: "$_id",
            count: 1,
            _id: 0
          },
        },
      ]);
      console.log("categoryCourseData: ", categoryCourseData);
  
      res.status(200).json(categoryCourseData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching category course data', error });
    }
  };


  export const getStudentEnrollmentsByDate = async (req: Request, res: Response) => {
    try {
      const { month, year } = req.query;
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);

      const isCurrentMonth = startDate.getMonth() === new Date().getMonth() && startDate.getFullYear() === new Date().getFullYear();
  
      let groupByFormat = isCurrentMonth ? '%Y-%U' : '%Y-%m-%d';
  
      const enrollmentData = await Enrollment.aggregate([
        {
          $match: {
            enrollmentDate: { $gte: startDate, $lt: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: groupByFormat, date: "$enrollmentDate" }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
  
      const result = enrollmentData.map(entry => ({
        date: entry._id,
        count: entry.count
      }));
  
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching student enrollments by date:', error);
      return res.status(500).json({ error: 'Server Error' });
    }
  };
  
  
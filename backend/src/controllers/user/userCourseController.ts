// src/controllers/userCourseController.ts

import { Request, Response } from 'express';
import Course,{ ICourse } from '../../models/Course';
import Tutor from '../../models/Tutor'; 
import FinancialAid from '../../models/FinancialAid';

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses: ICourse[] = await Course.find({ isDelete: false }).select('name description thumbnail price level category estimatedPrice');
    
    
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: (error as Error).message,
    });
  }
};



export const getCourseDetails = async (req: Request, res: Response) => {
  try {
    console.log("Entered to Personal courses");
    
    const courseId = req.params.courseId;
    const userId = req.query.userId as string;
    console.log("userID----------",userId);
    
    console.log(courseId);
    
    const course: ICourse | null = await Course.findOne({ _id: courseId, isDelete: false })
      .select('name description thumbnail price estimatedPrice level category tags demoUrl benefits prerequisites tutorId')
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const videoCount = await Course.aggregate([
      { $match: { _id: course._id } },
      { $project: { videoCount: { $size: "$videos" } } }
    ]);

    // Fetch tutor name
    const tutor = await Tutor.findById(course.tutorId).select('name').lean();

    // Check if the user has an approved financial aid for this course
    const financialAid = await FinancialAid.findOne({
      userId,
      courseId,
      status: 'approved'
    });

    const hasApprovedFinancialAid = !!financialAid;

    const courseData = {
      ...course,
      videoCount: videoCount[0].videoCount,
      tutorName: tutor ? tutor.name : 'Unknown Tutor',
      hasApprovedFinancialAid
    };

    console.log("courseData>>", courseData);

    res.status(200).json({
      success: true,
      course: courseData,
    });
    console.log("Successfully sent CourseData")
  } catch (error) {
    console.log("Failed to send CourseData")
    res.status(500).json({ 
      success: false,
      message: (error as Error).message,
    });
  }
};

export const applyForFinancialAid = async (req: Request, res: Response) => {
    console.log("Lets Upload Finacial Aids");
    
    try {
        console.log("Finacial Aids Contents:- \n",req.body);
        
      const { courseId } = req.params;
      const { userId } = req.body;
      const { reason, description, academicEmail, careerGoals } = req.body;
  
      // Validate the course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
  
      // Check if the user has already applied for financial aid for this course
      const existingApplication = await FinancialAid.findOne({ userId, courseId });
      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: "You have already applied for financial aid for this course!\nPlease Wait Until You get Approved",
        });
      }
  
      // Create a new financial aid application
      const financialAidApplication = new FinancialAid({
        userId,
        courseId,
        reason,
        description,
        academicEmail,
        careerGoals,
        status: 'pending', 
      });
  
      await financialAidApplication.save();
  
      res.status(201).json({
        success: true,
        message: "Financial aid application submitted successfully",
        application: financialAidApplication,
      });
  
    } catch (error) {
      console.error("Error in applying for financial aid:", error);
      res.status(500).json({ 
        success: false,
        message: "An error occurred while processing your application",
      });
    }
  };

  export const getCourseVideos = async (req: Request, res: Response) => {
    try {
      const courseId = req.params.courseId;
      const userId = req.query.userId as string;
  
      // Check if the user has approved financial aid for this course
      const financialAid = await FinancialAid.findOne({
        userId,
        courseId,
        status: 'approved'
      });
  
      if (!financialAid) {
        return res.status(403).json({
          success: false,
          hasAccess: false,
          message: "You don't have access to this course",
        });
      }
  
      // Fetch course videos
      const course = await Course.findById(courseId).select('videos');
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
  
      res.status(200).json({
        success: true,
        hasAccess: true,
        videos: course.videos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
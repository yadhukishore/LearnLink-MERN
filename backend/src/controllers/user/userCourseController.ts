// src/controllers/userCourseController.ts

import { Request, Response } from 'express';
import Course,{ ICourse } from '../../models/Course';
import Tutor from '../../models/Tutor'; 

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

    const courseData = {
      ...course,
      videoCount: videoCount[0].videoCount,
      tutorName: tutor ? tutor.name : 'Unknown Tutor'
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
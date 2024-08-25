// src/controllers/userCourseController.ts

import { Request, Response } from 'express';
import Course,{ ICourse } from '../../models/Course';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Tutor from '../../models/Tutor'; 
import FinancialAid from '../../models/FinancialAid';
import Enrollment from '../../models/Enrollment';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});


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
    const courseId = req.params.courseId;
    const userId = req.query.userId as string;
    
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

    const tutor = await Tutor.findById(course.tutorId).select('name').lean();

    const financialAid = await FinancialAid.findOne({
      userId,
      courseId,
      status: 'approved'
    });

    const enrollment = await Enrollment.findOne({
      userId,
      courseId,
      status: 'paid'
    });

    const hasAccess = !!financialAid || !!enrollment;

    const courseData = {
      ...course,
      videoCount: videoCount[0].videoCount,
      tutorName: tutor ? tutor.name : 'Unknown Tutor',
      hasAccess
    };

    res.status(200).json({
      success: true,
      course: courseData,
    });
  } catch (error) {
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
  

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
  
      const existingApplication = await FinancialAid.findOne({ userId, courseId });
      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: "You have already applied for financial aid for this course!\nPlease Wait Until You get Approved",
        });
      }
  
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
  
      // Check for approved financial aid
      const financialAid = await FinancialAid.findOne({
        userId,
        courseId,
        status: 'approved'
      });
  
      // Check for paid enrollment
      const enrollment = await Enrollment.findOne({
        userId,
        courseId,
        status: 'paid'
      });
  
      // Grant access if either financial aid is approved or enrollment is paid
      const hasAccess = !!financialAid || !!enrollment;
  
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          hasAccess: false,
          message: "You don't have access to this course",
        });
      }
  
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

  export const getCurrentCourses = async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string; 
      // console.log("getCurrentCourses>", req.query);
      
      const approvedCourses = await FinancialAid.find({ userId, status: 'approved' })
        .populate('courseId', 'name description thumbnail price estimatedPrice level category')
        .lean();
  
      const currentCourses = approvedCourses.map(aid => ({
        ...aid.courseId,
        // progress: 0 
      }));
      console.log("currentCourses", currentCourses);
  
      res.status(200).json({
        success: true,
        currentCourses,
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: (error as Error).message,
      });
    }
  };


  export const getCheckoutCourseDetails = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.query.userId as string;

    const course: ICourse | null = await Course.findOne({ _id: courseId, isDelete: false })
      .select('name description thumbnail price tutorId')
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const tutor = await Tutor.findById(course.tutorId).select('name').lean();

    const courseData = {
      ...course,
      tutorName: tutor ? tutor.name : 'Unknown Tutor',
    };

    res.status(200).json({
      success: true,
      course: courseData,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: (error as Error).message,
    });
  }
};

/**
 * RazorPay
 */

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { courseId, userId } = req.body;
    console.log(`On createOrder ${courseId} , ${userId}.`);
    console.log(`Body:- ${req.body}`);

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const options = {
      amount: course.price * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${new Date().getTime()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("Order: ",order)

    res.status(200).json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Error creating order' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userId,
      amount,
      currency,
      status
    } = req.body;
    console.log("Verify payment: ", req.body);

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Transaction not legit!' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    const enrollment = new Enrollment({
      userId,
      courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: amount || course.price * 100, // Use the amount from request or calculate from course price
      currency: currency || 'INR',
      status: status || 'paid',
      created_at: new Date()
    });
    console.log("Enrollment: ", enrollment);
    await enrollment.save();
    await Course.findByIdAndUpdate(courseId, { $inc: { purchased: 1 } });

    res.status(200).json({ success: true, message: 'Payment verified and enrollment successful' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
};
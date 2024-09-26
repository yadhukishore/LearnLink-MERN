import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Course from '../../models/Course';
import ReviewCourse from '../../models/ReviewCourse';

export const postFeedbackAndRating = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { rating, comment, userId } = req.body;

    console.log(`User ID ${userId} added a ${rating} rating to course ${courseId}`);

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      console.log("Course Not found");
      return res.status(404).json({ message: 'Course not found.' });
    }

    const existingReview = await ReviewCourse.findOne({ course: courseId, user: userId });

    let review;
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      review = await existingReview.save();
      console.log("Existing Review updated successfully",review);
    } else {
      const newReview = new ReviewCourse({
        user: new mongoose.Types.ObjectId(userId), 
        course: course._id, 
        rating,
        comment,
      });
      review = await newReview.save();
      console.log("Review created successfully", review);
    }

    
    console.log("Sette")
    return res.status(201).json({
      message: 'Feedback submitted successfullytta',
      review: review,
    })
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({ message: 'Error submitting feedback', error: error });
  }
};

export const getReviewsForCourse = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
  
      const reviews = await ReviewCourse.find({ course: courseId })
        .populate('user', 'name')
        .sort({ createdAt: -1 });
        console.log("reviews",reviews);
  
      return res.status(200).json({
        success: true,
        reviews,
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ message: 'Error fetching reviews', error: error });
    }
  };


  export const reportCourse = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { userId } = req.body;
      console.log(`Reporting Course: ${courseId}`);
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      const course = await Course.findById(courseId);
  
      if (!course) {
        console.log("Course not found");
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const userObjectId = new mongoose.Types.ObjectId(userId);
      if (!course.reportedBy.some(id => id.toString() === userObjectId.toString())) {
        course.reportedBy.push(userObjectId as any);
        await course.save();
      }
      console.log("Course reported successfully")
      res.status(200).json({ message: 'Course reported successfully' });
    } catch (error) {
      console.error('Error reporting course:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const getCourseStatus = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const { userId } = req.query;  
  
      console.log("getCourseStatus called for courseId:", courseId, "userId:", userId);
  
      if (!mongoose.Types.ObjectId.isValid(userId as string)) {
        console.log("Invalid UserId")
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      const course = await Course.findById(courseId);
  
      if (!course) {
        console.log("Course not found");
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const userObjectId = new mongoose.Types.ObjectId(userId as string);

      const isReported = course.reportedBy.some(id => id.toString() === userObjectId.toString());
      console.log("IsReported:::",isReported);
  
      res.status(200).json({ isReported });
    } catch (error) {
      console.error('Error fetching course status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
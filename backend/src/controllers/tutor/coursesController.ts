//tutor/coursesController.ts
import { Request, Response } from 'express';
import Course, { ICourse } from '../../models/Course';
import { cloudinary } from '../../config/fileUploads'; 
import { UploadApiResponse } from 'cloudinary';
import CourseCategory from '../../models/CourseCategory';
import mongoose from 'mongoose';

interface MulterRequest extends Request {
  files?: {
    thumbnailFile?: Express.Multer.File[];
    videos?: Express.Multer.File[];
  };
}

interface MongoError extends Error {
  code?: number;
  keyPattern?: { [key: string]: any };
}


export const createCourse = async (req: Request, res: Response): Promise<void> => {
  const multerReq = req as MulterRequest;
  try {
    console.log("Entered createCourses");
    console.log("Body:", multerReq.body);
    console.log("Files:", multerReq.files);

    let {
      name,
      description,
      price,
      estimatedPrice,
      tags,
      level,
      demoUrl,
      category,
      benefits,
      prerequisites,
      tutorId,
    } = multerReq.body;

    const courseId = generateUniqueCourseId();
    console.log("CourseId:-", courseId);

    // Upload thumbnail to Cloudinary
    let thumbnailUpload: UploadApiResponse | undefined;
    if (multerReq.files?.thumbnailFile && multerReq.files.thumbnailFile[0]) {
      thumbnailUpload = await cloudinary.uploader.upload(multerReq.files.thumbnailFile[0].path, {
        folder: 'course_thumbnails',
      });
    }

    // Upload videos to Cloudinary
    const videoUploads: UploadApiResponse[] = [];
    if (multerReq.files?.videos) {
      for (const video of multerReq.files.videos) {
        const videoUpload = await cloudinary.uploader.upload(video.path, {
          folder: 'course_videos',
          resource_type: 'video',
        });
        videoUploads.push(videoUpload);
      }
    }

    const courseData = {
      courseId,
      name,
      description,
      price: Number(price),
      estimatedPrice: Number(estimatedPrice),
      tags,
      level,
      demoUrl,
      category,
      benefits: typeof benefits === 'string' ? JSON.parse(benefits) : benefits,
      prerequisites: typeof prerequisites === 'string' ? JSON.parse(prerequisites) : prerequisites,
      tutorId,
      thumbnail: thumbnailUpload
        ? {
            public_id: thumbnailUpload.public_id,
            url: thumbnailUpload.secure_url,
          }
        : undefined,
      videos: videoUploads.map((upload, index) => ({
        file: `video-${index + 1}`,
        title: `Video ${index + 1}`,
        description: `Description for Video ${index + 1}`,
        videoUrl: upload.secure_url,
        videoThumbnail: {
          public_id: upload.public_id,
          url: upload.secure_url,
        },
      })),
      ratings: 0,
      purchased: 0,
      isDelete: false,
    };

    const newCourse: ICourse = new Course(courseData);
    await newCourse.save();

    res.status(201).json({
      success: true,
      course: newCourse,
      message: "Course created successfully",
    });
  } catch (error) {
    console.error("Error in createCourse:", error);
    const mongoError = error as MongoError;
    if (mongoError.code === 11000 && mongoError.keyPattern && mongoError.keyPattern.courseId) {
      // Handle duplicate courseId
      console.log("Duplicate courseId, generating a new one and retrying...");
      return createCourse(req, res); // Retry with new courseId
    }
    res.status(400).json({
      success: false,
      message: mongoError.message,
    });
  }
}

function generateUniqueCourseId(): string {
  return `course${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}

// Get all courses
export const getCourses = async (req: Request, res: Response) => {
  try {
    const tutorId = req.params.tutorId;
    if (!tutorId) {
      return res.status(400).json({ success: false, message: 'Tutor ID is required' });
    }
    const courses: ICourse[] = await Course.find({ tutorId: tutorId, isDelete: false });

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

// Get a single course by ID
export const getCourseById = async (req: Request, res: Response) => {
  try {
      const courseId = req.params.courseId;
      console.log('Fetching course with ID:', courseId);

      const course: ICourse | null = await Course.findOne({ _id: courseId, isDelete: false });

      if (!course) {
        console.log('Course not found');
          return res.status(404).json({
              success: false,
              message: "Course not found",
          });
      }
      console.log('Course found:', course);


      res.status(200).json({
          success: true,
          course: {
              _id: course._id,
              name: course.name,
              description: course.description,
              thumbnail: course.thumbnail,
              price: course.price,
              estimatedPrice:course.estimatedPrice,
              level: course.level,
              videos: course.videos.map(video => ({
                  title: video.title,
                  description: video.description,
                  videoUrl: video.videoUrl
              })),
              // i will add nother fields if needed
          },
      });
  } catch (error) {
    console.error('Error in getCourseById:', error);
      res.status(500).json({ 
          success: false,
          message: (error as Error).message,
      });
  }
};

// // Update a course
// export const updateCourse = async (req: Request, res: Response) => {
//     try {
//         let course: ICourse | null = await Course.findOne({ _id: req.params.id, isDelete: false });

//         if (!course) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Course not found",
//             });
//         }

//         course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });

//         res.status(200).json({
//             success: true,
//             course,
//             message: "Course updated successfully",
//         });
//     } catch (error) {
//         res.status(400).json({ 
//             success: false,
//             message: (error as Error).message,
//         });
//     }
// };

// Delete a course (soft delete)
export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const course: ICourse | null = await Course.findOne({ _id: req.params.id, isDelete: false });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        course.isDelete = true;
        await course.save();

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: (error as Error).message,
        });
    }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findByIdAndUpdate(id, updates, { new: true });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error });
  }
};

export const updateCourseVideo = async (req: Request, res: Response) => {
  try {
    const { id, videoId } = req.params;
    const updates = req.body;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const videoIndex = course.videos.findIndex((video) => video.id.toString() === videoId);

    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }

    Object.assign(course.videos[videoIndex], updates);

    await course.save();

    res.status(200).json({ message: 'Course video updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course video', error });
  }
};
export const addCourseVideo = async (req: Request, res: Response) => {
  const multerReq = req as MulterRequest;
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const file = multerReq.file;

    if (!file || !title || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const videoUpload: UploadApiResponse = await cloudinary.uploader.upload(file.path, {
      folder: 'course_videos',
      resource_type: 'video',
    });

    const newVideo = {
      file: `video-${course.videos.length + 1}`,
      title: title,
      description: description,
      videoUrl: videoUpload.secure_url,
      videoThumbnail: {
        public_id: videoUpload.public_id,
        url: videoUpload.secure_url,
      },
    };

    course.videos.push(newVideo as any);
    await course.save();

    res.status(200).json({ message: 'Video added successfully', course });
  } catch (error) {
    console.error('Error in addCourseVideo:', error);
    res.status(500).json({ message: 'Error adding video', error: (error as Error).message });
  }
};
export const deleteCourseVideo = async (req: Request, res: Response) => {
  try {
    const { id, videoId } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const videoIndex = course.videos.findIndex((video) => video.id.toString() === videoId);

    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete video from Cloudinary
    await cloudinary.uploader.destroy(course.videos[videoIndex].videoThumbnail.public_id, { resource_type: 'video' });

    course.videos.splice(videoIndex, 1);
    await course.save();

    res.status(200).json({ message: 'Video deleted successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video', error });
  }
};

export const getAllCategoriesForTutor = async (req: Request, res: Response) => {
  try {
    const categoriesFromModel = await CourseCategory.find().sort({ createdAt: -1 });

    const coursesWithCategories = await Course.distinct('category');


    const allCategories = [
      ...categoriesFromModel.map(cat => ({ _id: cat._id, name: cat.name })),
      ...coursesWithCategories.map(category => ({ name: category }))
    ];

    const uniqueCategories = Array.from(new Set(allCategories.map(c => c.name)))
      .map(name => {
        return allCategories.find(c => c.name === name) || { name };
      });

    res.json(uniqueCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};
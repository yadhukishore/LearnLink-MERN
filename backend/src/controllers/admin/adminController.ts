import { Request, Response } from 'express';
import User from '../../models/User';
import Tutor from '../../models/Tutor';
import { sendTutorApprovalEmail  } from '../../utils/tutorVerificationMail';
import FinancialAid from '../../models/FinancialAid';
import Course from '../../models/Course';
import Feeds from '../../models/Feeds';
import CourseCategory from '../../models/CourseCategory';
import Enrollment from '../../models/Enrollment';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10)|| 10;
    const skip = (page-1)*limit;
    const [users,totalUsers]=await Promise.all([
      User.aggregate([
        {
          $project: {
            name: 1,
            email: 1,
            googleId: 1,
            isBlocked: 1,
            createdAt: 1,
            updatedAt: 1
          }
        },
        {
          $sort: { createdAt: -1 } 
        },
        {
          $skip:skip
        },
        {
          $limit:limit
        },
    ]),
    User.countDocuments({}),//Гит
  ]);
    console.log(users);
    res.json({
      users,
      totalPages:Math.ceil(totalUsers/limit),
      currentPage:page,
    });
  } catch (err) {
    console.error('Error in getUsers:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const getAllCoursesForAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find()
      .select('name thumbnail createdAt')
      .populate('tutorId', 'name');
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCourseDetailsForAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate('tutorId', 'name');
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
export const getEnrolledStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const approvedApplications = await FinancialAid.find({
      courseId: courseId,
      status: 'approved'
    }).populate('userId', 'name email');
    
    const financialAidStudents = approvedApplications.map(app => app.userId);

    const paidEnrollments = await Enrollment.find({
      courseId: courseId,
      status: 'paid'
    }).populate('userId', 'name email');

    const paidStudents = paidEnrollments.map(enrollment => enrollment.userId);

    const financialAidApprovedCount = financialAidStudents.length;
    const paidCount = paidStudents.length;

    res.json({
      financialAidApprovedCount,
      paidCount,
      paidStudents,
      financialAidStudents,
    });
  } catch (err) {
    console.error('Error fetching enrolled students:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

//users ne Report nokit Suspend Chyan (I will do it!)
export const toggleCourseSuspension = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    course.isDelete = !course.isDelete;
    await course.save();

    if (course.isDelete) {
      const tutor = await Tutor.findById(course.tutorId);
      if (tutor) {
        // await sendWarningEmail(tutor.email, course.name);
      }
    }

    res.json({ message: 'Course suspension status updated', isDelete: course.isDelete });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const toggleUserBlockStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    console.log("Toggling user status for userId:", userId);
    
    const user = await User.findById(userId);
    console.log("User found:", user);
    
    if (!user) {
      console.log("User not found");
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    user.isBlocked = !user.isBlocked;
    console.log("New isBlocked status:", user.isBlocked);
    
    await user.save();
    console.log("User saved successfully");
    
    res.json({ message: 'User status updated successfully', isBlocked: user.isBlocked });
  } catch (err) {
    console.error("Error in toggleUserBlockStatus:", err);
    res.status(500).json({ error: 'Server error', details: err });
  }
};


export const getTutorDetails = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }
    res.json(tutor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
// Approve a tutor
export const approveTutor = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;
    const { approve } = req.body;
    console.log("Approve:",approve);
    

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    tutor.isApprovedByAdmin = approve;
    await tutor.save();

    await sendTutorApprovalEmail(tutor.email, approve);

    res.json({ message: approve ? 'Tutor approved successfully' : 'Tutor declined' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating tutor approval status' });
  }
};

export const getPendingTutors = async (req: Request, res: Response) => {
  try {
    const tutors = await Tutor.find({ isApprovedByAdmin: false }).select('name email');
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending tutors' });
  }
};

export const getFinancialAidApplications = async (req: Request, res: Response) => {
  try {
    const applications = await FinancialAid.find()
      .populate('userId', 'name email')
      .populate('courseId', 'name')
      .select('userId courseId status createdAt');
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financial aid applications' });
  }
};

export const getFinancialAidDetails = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const application = await FinancialAid.findById(applicationId)
      .populate('userId', 'name email')
      .populate('courseId', 'name');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application details' });
  }
};

export const updateFinancialAidStatus = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    console.log("Staus body> ",req.body);
    
    
    const application = await FinancialAid.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json({ message: `Application ${status}`, application });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status' });
  }
};

export const showTutorsList = async (req: Request, res: Response) => {
  try {
    const tutors = await Tutor.find({ isApprovedByAdmin: true }).select('name email createdAt');
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tutors', error });
  }
};
export const toggleTutorBanStatus = async (req: Request, res: Response) => {
  console.log("TutorBAn Button")
  try {
    const { tutorId } = req.params;
    const tutor = await Tutor.findById(tutorId);
    console.log("Tutor "+tutor+" Alle")

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    tutor.isBanned = !tutor.isBanned;
    await tutor.save();

    res.json({ message: 'Tutor ban status updated', tutor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating tutor ban status', error });
  }
};

/* To get all the non deleted feeds on Admin side as 2 section reported and non reported! 
*/
export const getAdminFeeds = async (req: Request, res: Response) => {
  try {
    console.log("Get some Feeds to control")
    const feeds = await Feeds.find({ isDeleted: false })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const reportedFeeds = feeds.filter(feed => feed.isReported);
    const normalFeeds = feeds.filter(feed => !feed.isReported);

    res.status(200).json({
      reportedFeeds,
      normalFeeds
    });
  } catch (error) {
    console.error('Error fetching feeds:', error);
    res.status(500).json({ message: 'Error fetching feeds', error });
  }
};


export const adminRemovePost = async (req: Request, res: Response) => {
  try {
    const { feedId } = req.params;
    console.log(`Remove ${feedId} Post`)

    const updatedFeed = await Feeds.findByIdAndUpdate(
      feedId,
      { isDeleted: true },
      { new: true }
    );

    if (!updatedFeed) {
      return res.status(404).json({ message: 'Feed not found' });
    }

    res.status(200).json({ message: 'Feed removed successfully', feed: updatedFeed });
  } catch (error) {
    console.error('Error removing feed:', error);
    res.status(500).json({ message: 'Error removing feed', error });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 6;
    const skip = (page - 1) * limit;

    const [categoriesAggregation, totalCategories] = await Promise.all([
      CourseCategory.aggregate([
        {
          $sort: { createdAt: -1 }
        },
        {
          $project: {
            _id: 1,
            name: 1
          }
        },
        {
          $skip: skip
        },
        {
          $limit: limit
        }
      ]),
      CourseCategory.countDocuments({})
    ]);

    const courseCategoriesAggregation = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          courseCount: '$count',
          _id: 0
        }
      }
    ]);

    const allCategories = [
      ...categoriesAggregation,
      ...courseCategoriesAggregation.filter(cat => !categoriesAggregation.some(c => c.name === cat.name))
    ];

    const categoriesWithCount = await Promise.all(
      allCategories.map(async (category) => {
        if (category.courseCount === undefined) {
          const courseCount = await Course.countDocuments({ category: category.name });
          return {
            _id: category._id || null,
            name: category.name,
            courseCount
          };
        }
        return category;
      })
    );

    const totalPages = Math.ceil(totalCategories / limit);

    res.json({
      categories: categoriesWithCount,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};


export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const existingCategory = await CourseCategory.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      console.log("A category with this name already exists");
      return res.status(400).json({ message: 'A category with this name already exists' });
    }
    const newCategory = new CourseCategory({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Error adding category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    console.log("Entered in to ",name);

    const existingCategory = await CourseCategory.findOne({
      _id: { $ne: id },
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    if (existingCategory) {
      console.log("Editing category name already exists")
      return res.status(400).json({ message: 'Editing category name already exists' });
    }


    const updatedCategory = await CourseCategory.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCategory = await CourseCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
};
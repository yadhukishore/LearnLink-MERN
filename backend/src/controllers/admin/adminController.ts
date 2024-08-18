import { Request, Response } from 'express';
import User from '../../models/User';
import Tutor from '../../models/Tutor';
import { sendTutorApprovalEmail  } from '../../utils/tutorVerificationMail';
import FinancialAid from '../../models/FinancialAid';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password'); 
    console.log(users);
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
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
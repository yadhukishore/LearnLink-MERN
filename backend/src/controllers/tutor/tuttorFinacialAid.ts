import { Request, Response } from 'express';
import Tutor , {ITutor} from '../../models/Tutor';
import FinancialAid from "../../models/FinancialAid";

export const getFinancialAidApplicationsForTutor = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 10; 
    const skip = (page - 1) * limit; 

    const [applications, total] = await Promise.all([
      FinancialAid.find()
        .populate('userId', 'name email')
        .populate('courseId', 'name')
        .select('userId courseId status createdAt')
        .skip(skip)
        .limit(limit),
      FinancialAid.countDocuments(),
    ]);

    res.json({ applications, total });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financial aid applications' });
  }
};

  export const getFinancialAidDetailsForTutor = async (req: Request, res: Response) => {
    try {
      const { applicationId } = req.params;
      console.log('Fetching application details for ID:', applicationId);
      const application = await FinancialAid.findById(applicationId)
        .populate('userId', 'name email')
        .populate('courseId', 'name');
      
      if (!application) {
        console.log('Application not found for ID:', applicationId);
        return res.status(404).json({ message: 'Application not found' });
      }
      
      console.log('Sending application data:', application);
      res.json(application);
    } catch (error) {
      console.error('Error in getFinancialAidDetailsForTutor:', error);
      res.status(500).json({ message: 'Error fetching application details' });
    }
  };

  export const updateFinancialAidStatusForTutor = async (req: Request, res: Response) => {
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
  
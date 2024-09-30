import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Tutor from '../../models/Tutor';
import { cloudinary } from '../../config/fileUploads';

export const tutorRegister = async (req: Request, res: Response) => {
    try {
        console.log("Tutor is trying to register!!!");
        console.log("Bodey:-",req.body);
        
        const { name, email, password } = req.body;
        
          if (!name || !email || !password) {
            console.log("All fields required");
            
            return res.status(400).json({ message: 'All fields are required' });
        }
    
        let tutor = await Tutor.findOne({ email });
        if (tutor) {
            return res.status(400).json({ message: 'Tutor with this email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
    
        tutor = new Tutor({
          name,
          email,
          password: hashedPassword,
        });
    
        await tutor.save();
    
        res.status(201).json({ message: 'Tutor registered successfully', tutorId: tutor._id });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const checkFileSize = (base64String: string): boolean => {
  const buffer = Buffer.from(base64String, 'base64');
  return buffer.length <= MAX_FILE_SIZE;
};
export const tutorSubmitingProofs = async (req: Request, res: Response) => {
  console.log("tutorSubmitingProofs");
  console.log("Request params:", req.params);

  try {
    console.log("Trying to submit tutor proofs");
    
    const { tutorId } = req.params;
    // console.log("Request body:", req.body);
    const { description, teacherProof, qualifications, experienceProofs } = req.body;
    
    console.log("tutorId", tutorId);
    console.log("description", description);
    
    if (!teacherProof || !qualifications || !experienceProofs || !description) {
      return res.status(400).json({ message: 'All proofs and description are required' });
    }
    if (!checkFileSize(teacherProof) || !checkFileSize(qualifications) || !checkFileSize(experienceProofs)) {
      return res.status(400).json({ message: 'One or more files exceed the maximum size limit of 5MB' });
    }
    const uploadToCloudinary = async (base64String: string) => {
      try {
        console.log('Attempting to upload to Cloudinary...');
        const result = await cloudinary.uploader.upload(base64String, {
          folder: 'tutor_proofs',
          allowed_formats: ['jpg', 'png', 'pdf'],
          transformation: [{ width: 500, height: 500, crop: 'limit' }]
        });
        console.log('Cloudinary upload successful:', result);
        return result.secure_url;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        if (error instanceof Error) {
          console.error('Error name:', error.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        throw new Error('Failed to upload file to Cloudinary');
      }
    };

    const [teacherProofUrl, qualificationsUrl, experienceProofsUrl] = await Promise.all([
      uploadToCloudinary(teacherProof),
      uploadToCloudinary(qualifications),
      uploadToCloudinary(experienceProofs)
    ]);

    console.log('Proof URLs:', { teacherProofUrl, qualificationsUrl, experienceProofsUrl });
    console.log('Description:', description);

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    tutor.proofs = { 
      teacherProof: teacherProofUrl, 
      qualifications: qualificationsUrl, 
      experienceProofs: experienceProofsUrl 
    };
    tutor.description = description;

    await tutor.save();
    console.log("Proofs submitted successfully");
    
    res.status(200).json({ message: 'Proofs submitted successfully' });
  } catch (error) {
    console.error('Proof Submission error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ message: 'Server error during Proof Submission', error: error instanceof Error ? error.message : String(error) });
  }
};

export const tutorLogin = async (req: Request, res: Response) => {
  try {
    console.log("Tutor is trying to LOGIN");
    
    const { email, password } = req.body;
    console.log("Email: ",email);
    const tutor = await Tutor.findOne({ email });
    if (!tutor) {
      console.log("Invalid creds");
      
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    if (tutor.isBanned){
      console.log("Banned Tutor");
      return res.status(400).json({ success: false, message: 'Banned Tutor,Please Try another Account' });
    }
    console.log("name:",tutor.name);
    
    const isMatch = await bcrypt.compare(password, tutor.password);
    if (!isMatch) {
      console.log("Invalid credentials");
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    if (!tutor.isApprovedByAdmin) {
      console.log("Your account is pending approval by the admin");
      return res.status(403).json({ success: false, message: 'Your account is pending approval by the admin' });
    }
    const token = jwt.sign(
      { id: tutor._id,userType: 'tutor'  },
      process.env.TUTOR_JWT_SECRET as string,
      { expiresIn: '1d' }
    );
console.log("Tokened");

    res.json({
      success: true,
      message: 'Login successful',
      token,
      tutor: {
        id: tutor._id,
        name: tutor.name,
        email: tutor.email
      }
    });
   console.log("Logged");
   
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};
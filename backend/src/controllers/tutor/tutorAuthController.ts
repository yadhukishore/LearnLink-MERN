import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Tutor from '../../models/Tutor';

export const tutorRegister = async (req: Request, res: Response) => {
    try {
        console.log("Tutor is trying to register!!!");
        const { name, email, password } = req.body;
    
        let tutor = await Tutor.findOne({ email });
        if (tutor) {
          return res.status(400).json({ message: 'Tutor already exists' });
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

export const tutorSubmitingProofs = async (req: Request, res: Response) => {
    try {
        console.log("Trying to submit tutor proofs");
        
        const { tutorId } = req.params;
        const { teacherProof, qualifications, experienceProofs, description } = req.body;
    
        const tutor = await Tutor.findById(tutorId);
        if (!tutor) {
          return res.status(404).json({ message: 'Tutor not found' });
        }
    
        tutor.proofs = { teacherProof, qualifications, experienceProofs };
        tutor.description = description;
    
        await tutor.save();
        console.log("Proofs submitted successfully");
        
        res.status(200).json({ message: 'Proofs submitted successfully' });
      } catch (error) {
        console.error('Proof Submision error:', error);
        res.status(500).json({ message: 'Server error during Proof Submision ' });
      }
}